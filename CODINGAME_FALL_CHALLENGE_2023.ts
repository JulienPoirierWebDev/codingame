/**
 * Score points by scanning valuable fish faster than your opponent.
 **/

const updateVisibleCreature = (creatureToUpdate:CreatureType, newData: {creatureX:number, creatureY:number, creatureVx:number, creatureVy:number}, actualTurn:number) => {

    creatureToUpdate.target = false
    creatureToUpdate.creatureX = newData.creatureX;
    creatureToUpdate.creatureY = newData.creatureY;

    creatureToUpdate.futureCreatureX = newData.creatureX + newData.creatureVx;
    creatureToUpdate.futureCreatureY = newData.creatureY + newData.creatureVy;
    creatureToUpdate.turnLastSee = actualTurn;
    creatureToUpdate.isVisible = true;
}

const updateNotVisiblesCreatures = (groupOfCreatures: CreatureType[]) => {
    const creaturesNotVisible = groupOfCreatures.filter((creature) => !creature.isVisible)

    for(let i = 0; i < creaturesNotVisible.length; i++) {
        creaturesNotVisible[i].target = false;
        if(creaturesNotVisible[i].creatureVx && creaturesNotVisible[i].creatureVy) {
            creaturesNotVisible[i].creatureX = creaturesNotVisible[i].creatureX + creaturesNotVisible[i].creatureVx
            creaturesNotVisible[i].creatureY = creaturesNotVisible[i].creatureY + creaturesNotVisible[i].creatureVy

        }
    }
}

type PointType = {
    x:number,
    y:number
}

const getDistance = (point1:PointType, point2:PointType) => {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

type CreatureType = {
    creatureId:number,
    color:number,
    type:number,
    isScannedByMe:boolean,
    isScannedByFoe:boolean,
    isTempScan:boolean,
    creatureX?:number,
    creatureY?:number,
    creatureVx?:number,
    creatureVy?:number,
    futureCreatureX?:number,
    futureCreatureY?:number,
    turnLastSee:number,
    isVisible:boolean,
    side?:any,
    target:boolean
}

type GroupOfCreatureType = CreatureType[];

type DroneType = {
    droneId: number,
    droneX: number,
    droneY: number,
    emergency: number,
    battery:number,
    actualScans: number[] | undefined,
    name:string,
    nearestCreature?:CreatureType,
    nearestCreatureDistance?:number,
    goRight?:boolean,
    goBottom?:boolean,
    dangerNear?:boolean,
    side?:"TL"|"TR"|"BL"|"BR",
    dangerCreature?:CreatureType[],
    newX?:number,
    modifyX?:number,
    modifyY?:number,
    nextTarget?:number,
    nextTargetSide?:"TL"|"TR"|"BL"|"BR",
    fishs:CreatureType[]
}

let groupOfMyDrones:DroneType[] = []

const groupOfFoeDrones:DroneType[] = []

const groupOfCreatures:GroupOfCreatureType = [];

let actualTurn = 0;


const creatureCount: number = parseInt(readline());
for (let i = 0; i < creatureCount; i++) {
    var inputs: string[] = readline().split(' ');
    const creatureId: number = parseInt(inputs[0]);
    const color: number = parseInt(inputs[1]);
    const type: number = parseInt(inputs[2]);
    const newCreature:CreatureType = {
        creatureId:creatureId,
        color,
        type,
        isScannedByMe:false,
        isScannedByFoe:false,
        isTempScan:false,
        turnLastSee:actualTurn,
        isVisible:false,
        side:{},
        target:false
    }

    groupOfCreatures.push(newCreature)
}

//console.error(groupOfCreatures.length)

let nearestCreature:CreatureType | null

// game loop
while (true) {
    actualTurn++

    nearestCreature = null;

    for(let creatureIndex = 0; creatureIndex < groupOfCreatures.length; creatureIndex++ ) {
        groupOfCreatures[creatureIndex].isVisible = false;
        groupOfCreatures[creatureIndex].isTempScan = false;
    }


    const myScore: number = parseInt(readline());
    const foeScore: number = parseInt(readline());
    const myScanCount: number = parseInt(readline());
    for (let i = 0; i < myScanCount; i++) {
        const creatureId: number = parseInt(readline());
        const creature = groupOfCreatures.find(c => c.creatureId === creatureId);
        if (creature) {
            creature.isTempScan = true;
        }
    }
    const foeScanCount: number = parseInt(readline());
    for (let i = 0; i < foeScanCount; i++) {
        const creatureId: number = parseInt(readline());
        const creature = groupOfCreatures.find(c => c.creatureId === creatureId);
        if (creature) {
            creature.isScannedByFoe = true;
        }
    }

    const myDroneCount: number = parseInt(readline());
    for (let i = 0; i < myDroneCount; i++) {
        var inputs: string[] = readline().split(' ');
        const droneId: number = parseInt(inputs[0]);
        const droneX: number = parseInt(inputs[1]);
        const droneY: number = parseInt(inputs[2]);
        const emergency: number = parseInt(inputs[3]);
        const battery: number = parseInt(inputs[4]);

        const drone = groupOfMyDrones.find((drone) => drone.droneId === droneId)
        //console.error(droneId)

        if(drone) {

            drone.droneX = droneX 
            drone.droneY = droneY 
            drone.battery = battery
            drone.dangerNear = false;
            drone.side = null;

        } else {
            const newDrone = {
                droneId,
                droneX,
                droneY,
                emergency,
                battery,
                actualScans:[],
                name: `myDrone${i}`,
                goRight:!Boolean(i%2),
                goBottom:true,
                dangerNear:false,
                dangerCreature:[],
                fishs:[]
            }
    
            groupOfMyDrones.push(newDrone)
        }

      
    }
    const foeDroneCount: number = parseInt(readline());
    for (let i = 0; i < foeDroneCount; i++) {
        var inputs: string[] = readline().split(' ');
        const droneId: number = parseInt(inputs[0]);
        const droneX: number = parseInt(inputs[1]);
        const droneY: number = parseInt(inputs[2]);
        const emergency: number = parseInt(inputs[3]);
        const battery: number = parseInt(inputs[4]);

        
        const newDrone = {
            droneId,
            droneX,
            droneY,
            emergency,
            battery,
            actualScans : [],
            name: `foeDrone${i}`,
            fishs:[]

        }

        groupOfFoeDrones.push(newDrone)
    }
    const droneScanCount: number = parseInt(readline());
    for (let i = 0; i < droneScanCount; i++) {
        var inputs: string[] = readline().split(' ');
        const droneId: number = parseInt(inputs[0]);
        const creatureId: number = parseInt(inputs[1]);
        const myDrone = groupOfMyDrones.find((drone) => {
            return drone.droneId === droneId
        });

        const creature = groupOfCreatures.find((creature) => creature.creatureId === creatureId)
        if(myDrone) {
            const isAlreadyScan = myDrone.actualScans.find((scanId) => scanId === creatureId);
            if(!isAlreadyScan) {
                myDrone.actualScans.push(creatureId)
            }
            creature.isScannedByMe = true;

     
        } else {
            creature.isScannedByFoe = true;
        }

    }
    const visibleCreatureCount: number = parseInt(readline());
    //console.error("visible", visibleCreatureCount)
    for (let i = 0; i < visibleCreatureCount; i++) {
        var inputs: string[] = readline().split(' ');
        const creatureId: number = parseInt(inputs[0]);
        const creatureX: number = parseInt(inputs[1]);
        const creatureY: number = parseInt(inputs[2]);
        const creatureVx: number = parseInt(inputs[3]);
        const creatureVy: number = parseInt(inputs[4]);

        const creature = groupOfCreatures.find(c => c.creatureId === creatureId);
 
        updateVisibleCreature(creature, {creatureX, creatureY, creatureVx, creatureVy}, actualTurn)
    }

    updateNotVisiblesCreatures(groupOfCreatures);


    const radarBlipCount: number = parseInt(readline());
    for (let i = 0; i < radarBlipCount; i++) {
        var inputs: string[] = readline().split(' ');
        const droneId: number = parseInt(inputs[0]);
        const creatureId: number = parseInt(inputs[1]);
        const radar: string = inputs[2];

        const creature = groupOfCreatures.find((creature) => creature.creatureId === creatureId && creature.isScannedByMe === false && creature.isTempScan === false) ;
        //console.error(creature)
        if(creature ) {
            creature.side[droneId] = radar;
        }
        
        const dangerousCreature = groupOfCreatures.find((creature) => creature.type === -1 && creature.creatureId === creatureId)

        const actualDrone = groupOfMyDrones.find((drone) => drone.droneId === droneId)

        if(!actualDrone.modifyX) {
            actualDrone.modifyX = 0;
        }
        actualDrone.newX = actualDrone.droneX;
 
        if(dangerousCreature) {
            const distance = getDistance({x:dangerousCreature.creatureX, y:dangerousCreature.creatureY}, {x:actualDrone.droneX, y:actualDrone.droneY})
            if(distance < 1500) {
                actualDrone.dangerNear = true

                // const angle = Math.atan2(dangerousCreature.creatureY - actualDrone.droneY, dangerousCreature.creatureX - actualDrone.droneX);
                // const anglePerpendiculaire = angle + Math.PI / 2;
                // let evasionX = actualDrone.droneX + 300 * Math.cos(anglePerpendiculaire);
                // let evasionY = actualDrone.droneY + 300 * Math.sin(anglePerpendiculaire);
                               
                // actualDrone.modifyX = Math.round(evasionX)
                // actualDrone.modifyY = Math.round(evasionY)

                actualDrone.modifyX = dangerousCreature.creatureX - actualDrone.droneX
                actualDrone.modifyY = dangerousCreature.creatureY-actualDrone.droneY
             
             
            }
        } else if(creature) {

            if(creature.isScannedByMe && creature.isTempScan) {
                console.error("do nothing")
            } else {
                actualDrone.fishs.push(creature)
            }


        }
    }


    for (let i = 0; i < myDroneCount; i++) {
        // groupOfMyDrones[i].modifyX = 0;
        // groupOfMyDrones[i].newX = groupOfMyDrones[i].droneX;


        //console.error(groupOfMyDrones[i].newX,  groupOfMyDrones[i].modifyX)

        if(groupOfMyDrones[i].droneY < 500) {
            for(let creatureIndex=0; creatureIndex < groupOfMyDrones[i].actualScans.length; creatureIndex++) {
                const actualCreature = groupOfCreatures.find((oneCreature) => oneCreature.creatureId === groupOfMyDrones[i].actualScans[creatureIndex])
                actualCreature.isScannedByMe = true;
            }
            groupOfMyDrones[i].actualScans = []
        }

        if(groupOfMyDrones[i].droneY < 500) {
            groupOfMyDrones[i].goBottom = true;
        }

        if(groupOfMyDrones[i].droneY > 8500) {
            groupOfMyDrones[i].goBottom = false;
        }

        if(groupOfMyDrones[i].dangerNear) {
            if(groupOfMyDrones[i].dangerCreature.length >= 2) {
                console.log(`MOVE ${groupOfMyDrones[i].newX + groupOfMyDrones[i].modifyX} 0 ${groupOfMyDrones[i].dangerNear ? "0" : "1"} DANGER-${groupOfMyDrones[i].dangerNear ?"DANGER" :""}` )
            }
            else if(groupOfMyDrones[i].modifyX !== 0) {
                //console.error("here" , groupOfMyDrones[i].modifyX )
                console.log(`MOVE ${groupOfMyDrones[i].newX - groupOfMyDrones[i].modifyX} ${groupOfMyDrones[i].droneY - groupOfMyDrones[i].modifyY} ${groupOfMyDrones[i].dangerNear ? "0" : "1"} ESCAPE-${groupOfMyDrones[i].dangerNear ?"DANGER" :""}` )
            }
        } 
        else if( groupOfMyDrones[i].goBottom === false || groupOfMyDrones[i].actualScans.length > 2) {
            console.log(`MOVE ${groupOfMyDrones[i].droneX} 0 ${groupOfMyDrones[i].dangerNear ? "0" : "1"} REMONTE-${groupOfMyDrones[i].dangerNear ?"DANGER" :""}` )
        } else {

            const targetFishs = groupOfMyDrones[i].fishs.filter((fish) => fish.target === false)
            const targetFish = targetFishs[0];
            let newX;
            let newY;
            if(targetFish) {
                targetFish.target = true;
                console.error(targetFish.creatureId)

                if(targetFish.creatureX && targetFish.creatureY && targetFish.turnLastSee < 10){
                    newX = targetFish.creatureX;
                    newY = targetFish.creatureY;
                } else {
                    const direction = targetFish.side[groupOfMyDrones[i].droneId];

                    switch(direction) {
                        //top left
                        case "TL": {
                            groupOfMyDrones[i].modifyX = +400;
                            groupOfMyDrones[i].modifyY = +400;   
                            }
                        // top right
                        case "TR": {
                            groupOfMyDrones[i].modifyX = +400;
                            groupOfMyDrones[i].modifyY = +400;   
                            }
                        case "BL": {
                            groupOfMyDrones[i].modifyX = -400;
                            groupOfMyDrones[i].modifyY = -400;   
                            }
                        case "BR": {
                            groupOfMyDrones[i].modifyX = -400;
                            groupOfMyDrones[i].modifyY = -400;   
                                    }
                    }
                    console.error(direction, groupOfMyDrones[i].droneY, groupOfMyDrones[i].modifyY)
                    newX = groupOfMyDrones[i].newX - groupOfMyDrones[i].modifyX;
                    newY = groupOfMyDrones[i].droneY - groupOfMyDrones[i].modifyY
                }
          

                console.log(`MOVE ${newX} ${newY} ${groupOfMyDrones[i].dangerNear ? "0" : "1"} track-${groupOfMyDrones[i].dangerNear ?"DANGER" :""}` )

            } else {
                groupOfMyDrones[i].goBottom = false;
                console.log(`MOVE ${groupOfMyDrones[i].goRight ? 10000 : 0} 10000 ${groupOfMyDrones[i].dangerNear ? "0" : "1"} ${groupOfMyDrones[i].dangerNear ?"DANGER" :""}` )

            }

        }

        if(groupOfMyDrones[i].droneX > 8500) {
            groupOfMyDrones[i].goRight = false;
        } else if(groupOfMyDrones[i].droneX < 1500) {
            groupOfMyDrones[i].goRight = true
        }

        groupOfMyDrones[i].dangerCreature = []
        groupOfMyDrones[i].modifyX = 0;
        groupOfMyDrones[i].modifyY = 0;
        groupOfMyDrones[i].fishs = []


        //console.error(groupOfCreatures)

    }
}
