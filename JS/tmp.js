
function init(event) {

    event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound Ubert_PhaseFinal master @p");


    event.npc.getAi().setNavigationType(1); //1 flying 0 ground 2 swimming
    event.npc.getAi().setWalkingSpeed(1);
    var x = event.npc.getX();
    var z = event.npc.getZ();
    var y = event.npc.getY();
    event.npc.setY(y+5);
    event.npc.setHome(x, y+5, z);

    /*
    event.npc.setX(x);
    event.npc.setY(y + 10);
    event.npc.setZ(z);
    */
    event.npc.stats.getMelee().setRange(10);
    event.npc.stats.getRanged().setRange(0);
    event.npc.stats.getRanged().setDelay(20, 20);
    


    event.npc.navigateTo(x, y + 10, z, 1);

    var ubertMinion1 = event.API.getClones().get(1, "Tsuka", event.npc.getWorld());
    ubertMinion1.getAi().setNavigationType(1); //1 flying 0 ground 2 swimming
    ubertMinion1.setHome(x + 10, y + 7, z);
    ubertMinion1.setPosition(x + 10, y + 7, z );
    ubertMinion1.spawn(); 

//    var ubertMinion2 = event.API.getClones().get(1, "Tsuka", event.npc.getWorld());
//    ubertMinion2.setHome(x, y, z - 4);
//    ubertMinion2.setPosition(x + randomIntFromInterval(3, 8), y+ 3, z + randomIntFromInterval(2, 4));
//
//    var ubertMinion3 = event.API.getClones().get(1, "Tsuka", event.npc.getWorld());
//    ubertMinion3.setHome(x + 4, y, z);
//    ubertMinion3.setPosition(x + randomIntFromInterval(3, 8), y+ 3, z + randomIntFromInterval(2, 4));
//
//    var ubertMinion4 = event.API.getClones().get(1, "Tsuka", event.npc.getWorld());
//    ubertMinion4.setHome(x - 4, y, z);
//    ubertMinion4.setPosition(x + randomIntFromInterval(3, 8), y+ 3, z + randomIntFromInterval(2, 4));

    var item = ubertMinion1.getWorld().createItem("variedcommodities:stone_dagger", 2, 5);
    var i = 0;
    var ite = 100;

    //var sizeToRemoveIte = ( 20 - event.npc.getSize() ) / 100;

    while(event.npc.getHealth() > 0 && i < ite) {
                
        ubertMinion1.shootItem​(event.npc, item, ite);
        i = i + 1;
        //event.npc.setSize(event.npc.getSize() - sizeToRemoveIte);
    }

    //event.npc.getAi().setNavigationType(0); //1 flying 0 ground 2 swimming
    //ubertMinion1.despawn();
//    ubertMinion2.despawn();
//    ubertMinion3.despawn();
//    ubertMinion4.despawn();
//    event.npc.navigateTo(x, y + 5, z, 4);
}