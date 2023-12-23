/**
 * Score points by scanning valuable fish faster than your opponent.
 **/

const updateCreature = (creatureToUpdate:CreatureType, newData: {creatureX:number, creatureY:number, creatureVx:number, creatureVy:number}, actualTurn:number) => {

    creatureToUpdate.creatureX = newData.creatureX;
    creatureToUpdate.creatureY = newData.creatureY;

    creatureToUpdate.futureCreatureX = newData.creatureX + newData.creatureVx;
    creatureToUpdate.futureCreatureY = newData.creatureY + newData.creatureVy;
    creatureToUpdate.turnLastSee = actualTurn;
    creatureToUpdate.isVisible = true;
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
    creatureX?:number,
    creatureY?:number,
    futureCreatureX?:number,
    futureCreatureY?:number,
    turnLastSee:number,
    isVisible:boolean
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
    side?:"TL"|"TR"|"BL"|"BR"
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
        turnLastSee:actualTurn,
        isVisible:false
    }

    groupOfCreatures.push(newCreature)
}

let nearestCreature:CreatureType | null
let minDistance:number;
let targetZone:number = 2;

// game loop
while (true) {
    actualTurn++

    minDistance = 10000;
    nearestCreature = null;
    //groupOfMyDrones = []

    for(let creatureIndex = 0; creatureIndex < groupOfCreatures.length; creatureIndex++ ) {
        groupOfCreatures[creatureIndex].isVisible = false;
    }


    const myScore: number = parseInt(readline());
    const foeScore: number = parseInt(readline());
    const myScanCount: number = parseInt(readline());
    for (let i = 0; i < myScanCount; i++) {
        const creatureId: number = parseInt(readline());
        const creature = groupOfCreatures.find(c => c.creatureId === creatureId);
        if (creature) {
            creature.isScannedByMe = true;
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
                goRight:Boolean(i%2),
                goBottom:true,
                dangerNear:false
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
            name: `foeDrone${i}`

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
        updateCreature(creature, {creatureX, creatureY, creatureVx, creatureVy}, actualTurn)

    }


    const isCreatureOfType2 = Boolean(groupOfCreatures.find((creature) => creature.type === 2 && creature.isScannedByMe === false))
    const isCreatureOfType1 = Boolean(groupOfCreatures.find((creature) => creature.type === 1 && creature.isScannedByMe === false))

    if(isCreatureOfType2) {
        targetZone = 2
    } else if(isCreatureOfType1) {
        targetZone = 1
    } else {
        targetZone = 0
    }

    const radarBlipCount: number = parseInt(readline());
    for (let i = 0; i < radarBlipCount; i++) {
        var inputs: string[] = readline().split(' ');
        const droneId: number = parseInt(inputs[0]);
        const creatureId: number = parseInt(inputs[1]);
        const radar: string = inputs[2];

        const dangerousCreature = groupOfCreatures.find((creature) => creature.type === -1 && creature.creatureId === creatureId)

        const actualDrone = groupOfMyDrones.find((drone) => drone.droneId === droneId)

        if(dangerousCreature && dangerousCreature.isVisible) {
            actualDrone.dangerNear = true;
            if(radar === "TL" || radar === "TR" ||  radar ==="BL" || radar === "BR") {
                actualDrone.side = radar;
            }
        }
        
  
        //console.error(droneId, creatureId, radar)
    }


    // for(let i = 0; i < groupOfCreatures.length ; i++) {

    //     const testedCreature = groupOfCreatures[i]

    //     for(let droneIndex = 0; droneIndex < groupOfMyDrones.length; droneIndex++) {

    //         const actualDrone = groupOfMyDrones[droneIndex];

    //         const isAlreadyScan = Boolean(actualDrone.actualScans.find((creatureId) => creatureId === testedCreature.creatureId))

    //         if(testedCreature.isScannedByMe === false && !isAlreadyScan) {
    //             const distanceBetweenDrone1AndCreature = getDistance({x:testedCreature.creatureX, y:testedCreature.creatureY}, {x: actualDrone.droneX, y :  actualDrone.droneY})
    
    //             if(distanceBetweenDrone1AndCreature<actualDrone.nearestCreatureDistance) {
        
    //                 actualDrone.nearestCreatureDistance = distanceBetweenDrone1AndCreature;
        
    //                 actualDrone.nearestCreature = testedCreature
    //             }
    //         }
            
    //     }
    // }


    for (let i = 0; i < myDroneCount; i++) {
        //console.error(groupOfMyDrones[i])
        // Write an action using console.log()
        // To debug: console.error('Debug messages...');




        if(groupOfMyDrones[i].droneY < 500) {
            groupOfMyDrones[i].actualScans = []
        }

        if(groupOfMyDrones[i].droneY < 500) {
            groupOfMyDrones[i].goBottom = true;
        }

        if(groupOfMyDrones[i].droneY > 9400) {
            groupOfMyDrones[i].goBottom = false;
        }

        console.error(groupOfMyDrones[i])

        if(groupOfMyDrones[i].side === "BR" || groupOfMyDrones[i].side === "TR") {
            if(groupOfMyDrones[i].goRight === true) {
                groupOfMyDrones[i].goRight = false;
            }
        } else if(groupOfMyDrones[i].side === "TL" || groupOfMyDrones[i].side === "BL") {
            if(groupOfMyDrones[i].goRight === false) {
                groupOfMyDrones[i].goRight = true;
            }
        }


        if( groupOfMyDrones[i].goBottom === false ) {
            console.log(`MOVE ${groupOfMyDrones[i].goRight ? 10000 : 0 } 0 0 REMONTE-${groupOfMyDrones[i].dangerNear ?"DANGER" :""}` )
        } else {

            console.log(`MOVE ${groupOfMyDrones[i].goRight ? 10000 : 0 } 10000 ${groupOfMyDrones[i].dangerNear ? "0" : "1"} TARGETZONE-${targetZone}"-"${groupOfMyDrones[i].dangerNear ?"DANGER" :""}` )
           

        }
         //console.error(i, groupOfMyDrones[i].droneX, groupOfMyDrones[i].goRight)
        if(groupOfMyDrones[i].droneX > 8500) {
            groupOfMyDrones[i].goRight = false;
        } else if(groupOfMyDrones[i].droneX < 1500) {
            groupOfMyDrones[i].goRight = true
        }

        // if(nearestCreature) {
        //     console.log(`MOVE ${nearestCreature.creatureX} ${nearestCreature.creatureY} 1 SEARCH`)
        // } else {
        //     if(groupOfMyDrones[0].actualScans.length >= 2) {
        //         console.log(`MOVE ${goRight ? 10000 : 0 } 0 0 REMONTE` )
        //     } else {
        //         console.log('WAIT 1');         // MOVE <x> <y> <light (1|0)> | WAIT <light (1|0)>
        //     }
        // }


    }
    //console.error(groupOfCreatures)
}
