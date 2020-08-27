var texture_mama = "zawa:textures/entity/galapagos_tortoise/galapagos_tortoise.png";
var model_mama = "zawa:galapagostortoise";
var name_mama = "Mawa";
var name_summoning = "Jeune Tortue";

function init(event) {
    //event.npc.getDisplay().setSkinUrl("https://fr.namemc.com/texture/6b9ffe331c76cc50.png");
    event.npc.getDisplay().setSize(8);
    event.npc.getDisplay().setTitle("Très grosse Tortue");
    event.npc.getDisplay().setModel(model_mama);
    event.npc.getDisplay().setSkinTexture(texture_mama);
    var resetMinions = event.npc.world.getNearbyEntities(event.npc.getX(), event.npc.getY(), event.npc.getZ(), 64, 2);
    for(var i = 0; i < resetMinions.length; i++) { if(resetMinions[i].display.name == name_summoning) { resetMinions[i].despawn(); } }

    event.npc.timers.clear();
    event.npc.display.setVisible(0);
    event.npc.setHealth(event.npc.getMaxHealth());
    event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound MamaSpawn master @p");
//    event.npc.world.broadcast("<Ubert the Banished> \u00A7cAssuming control!");
    event.npc.getAi().setWalkingSpeed(3);
    event.npc.stats.getMelee().setRange(2);
    event.npc.getAi().setNavigationType(0);
    event.npc.timers.start(1, 600, true);
}





function timer(event)  { 
    var x;
    var y;
    var z;
    if (event.id == 1)  {
        event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound MamaChildSpawning master @p");        
        event.npc.getAi().setNavigationType(1);

        var x = event.npc.getX();
        var z = event.npc.getZ();
        var y = event.npc.getY();


        event.npc.navigateTo(x, y, z, 5);
        event.npc.setPosition(x, y, z);


        var minionCount = randomIntFromInterval(8, 12);
        for (var i = 0; i < minionCount; i++) {
           var mamaMinion = event.API.getClones().get(1, name_summoning, event.npc.getWorld());
           var x2 = x + randomIntFromInterval(-10, 10);
           var y2 = y + 2;
           var z2 = z + randomIntFromInterval(-10, 10);
           mamaMinion.setHome(x2, y2, z2);
           mamaMinion.setPosition(x2, y2, z2);
           mamaMinion.spawn(); 
        }


    }
}



function died(event)
{
    event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound MamaDead master @p");
    if (event.npc.timers.has(1)) {
        event.npc.timers.stop(1);
    }
    event.npc.timers.clear();
    cleanup(event);
}

function randomIntFromInterval(min,max){ return Math.floor(Math.random()*(max-min+1)+min); }