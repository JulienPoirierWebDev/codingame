/**
 * Score points by scanning valuable fish faster than your opponent.
 **/

const updateCreature = (creatureToUpdate:CreatureType, newData: {creatureX:number, creatureY:number, creatureVx:number, creatureVy:number}, actualTurn:number) => {

    creatureToUpdate.creatureX = newData.creatureX;
    creatureToUpdate.creatureY = newData.creatureY;

    creatureToUpdate.futureCreatureX = newData.creatureX + newData.creatureVx;
    creatureToUpdate.futureCreatureY = newData.creatureY + newData.creatureVy;
    creatureToUpdate.turnLastSee = actualTurn;
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
    turnLastSee:number
}

type GroupOfCreatureType = CreatureType[];

type DroneType = {
    droneId: number,
    droneX: number,
    droneY: number,
    emergency: number,
    battery:number,
    actualScans: number[] | undefined
}

let groupOfMyDrones:DroneType[] = []

const groupOfFoeDrones:DroneType[] = []

const groupOfCreature:GroupOfCreatureType = [];

let actualTurn = 0;
let goRight = false


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
        turnLastSee:actualTurn
    }

    groupOfCreature.push(newCreature)
}

let nearestCreature:CreatureType | null
let minDistance:number

// game loop
while (true) {
    actualTurn++

    minDistance = 10000;
    nearestCreature = null;
    groupOfMyDrones = []


    const myScore: number = parseInt(readline());
    const foeScore: number = parseInt(readline());
    const myScanCount: number = parseInt(readline());
    for (let i = 0; i < myScanCount; i++) {
        const creatureId: number = parseInt(readline());
        const creature = groupOfCreature.find(c => c.creatureId === creatureId);
        if (creature) {
            creature.isScannedByMe = true;
        }
    }
    const foeScanCount: number = parseInt(readline());
    for (let i = 0; i < foeScanCount; i++) {
        const creatureId: number = parseInt(readline());
        const creature = groupOfCreature.find(c => c.creatureId === creatureId);
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

        const newDrone = {
            droneId,
            droneX,
            droneY,
            emergency,
            battery,
            actualScans:[]
        }

        groupOfMyDrones.push(newDrone)
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
            actualScans : []
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
        if(myDrone) {
            myDrone.actualScans.push(creatureId)
        }

    }
    const visibleCreatureCount: number = parseInt(readline());
    console.error("visible", visibleCreatureCount)
    for (let i = 0; i < visibleCreatureCount; i++) {
        var inputs: string[] = readline().split(' ');
        const creatureId: number = parseInt(inputs[0]);
        const creatureX: number = parseInt(inputs[1]);
        const creatureY: number = parseInt(inputs[2]);
        const creatureVx: number = parseInt(inputs[3]);
        const creatureVy: number = parseInt(inputs[4]);

        const creature = groupOfCreature.find(c => c.creatureId === creatureId);
        updateCreature(creature, {creatureX, creatureY, creatureVx, creatureVy}, actualTurn)

    }
    const radarBlipCount: number = parseInt(readline());
    for (let i = 0; i < radarBlipCount; i++) {
        var inputs: string[] = readline().split(' ');
        const droneId: number = parseInt(inputs[0]);
        const creatureId: number = parseInt(inputs[1]);
        const radar: string = inputs[2];
    }


    for(let i = 0; i < groupOfCreature.length ; i++) {

        const isAlreadyScan = Boolean(groupOfMyDrones[0].actualScans.find((creatureId) => creatureId === groupOfCreature[i].creatureId))

        if(groupOfCreature[i].isScannedByMe === false && !isAlreadyScan) {
            const distanceBetweenDrone1AndCreature = getDistance({x:groupOfCreature[i].creatureX, y:groupOfCreature[i].creatureY}, {x: groupOfMyDrones[0].droneX, y :  groupOfMyDrones[0].droneY})

            if(distanceBetweenDrone1AndCreature<minDistance) {
    
                minDistance = distanceBetweenDrone1AndCreature;
    
                nearestCreature = groupOfCreature[i]
            }
        }
        
   
    }


    for (let i = 0; i < myDroneCount; i++) {

        // Write an action using console.log()
        // To debug: console.error('Debug messages...');

        console.error(groupOfMyDrones[0].droneX)
        if(groupOfMyDrones[0].droneX > 9400) {
            goRight = false;
        } else if(groupOfMyDrones[0].droneX < 600) {
            goRight = true
        }

        if(nearestCreature) {
            console.log(`MOVE ${nearestCreature.creatureX} ${nearestCreature.creatureY} 1 SEARCH`)
        } else {
            if(groupOfMyDrones[0].actualScans.length >= 2) {
                console.log(`MOVE ${goRight ? 10000 : 0 } 0 0 REMONTE` )
            } else {
                console.log('WAIT 1');         // MOVE <x> <y> <light (1|0)> | WAIT <light (1|0)>
            }
        }


    }
}
