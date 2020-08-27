var texture_egg = "zawa:textures/entity/egg/egg.png";
var texture_turtle = "zawa:textures/entity/hawksbill_sea_turtle/sea_turtle_1.png";
var model_egg = "zawa:egg";
var model_turtle = "zawa:hawksbillseaturtle";
var name_egg = "Jeune Tortue";



function init(event) {
    //event.npc.getDisplay().setSkinUrl("https://fr.namemc.com/texture/6b9ffe331c76cc50.png");
    event.npc.getDisplay().setSize(10);
    event.npc.getDisplay().setTitle("Oeuf de Mama");
    event.npc.getDisplay().setModel(model_egg);
    event.npc.getDisplay().setSkinTexture(texture_egg);
//    var resetMinions = event.npc.world.getNearbyEntities(event.npc.getX(), event.npc.getY(), event.npc.getZ(), 64, 2);
//    for(var i = 0; i < resetMinions.length; i++) { if(resetMinions[i].display.name == name_egg) { resetMinions[i].despawn(); } }


    event.npc.timers.clear();
    event.npc.timers.start(1, 400, false);
    event.npc.timers.start(2, 800, false);


    event.npc.display.setVisible(0);
    event.npc.setHealth(5);//event.npc.getMaxHealth()
    event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound TurtleEggSpawn master @p");
//    event.npc.world.broadcast("<Ubert the Banished> \u00A7cAssuming control!");

    event.npc.getAi().setWalkingSpeed(0);
    event.npc.stats.getMelee().setRange(0);
    event.npc.getAi().setNavigationType(0);
}




function timer(event)  {  
    
    if (event.id == 2)  {   //CLEANUP
        event.npc.kill();
    } else {
        event.npc.getAi().setNavigationType(1);

        event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound TurtleEggHatch master @p");
    //    event.npc.world.broadcast("<Ubert the Banished> \u00A7cAssuming control!");
    
        event.npc.setHealth(event.npc.getMaxHealth());
        event.npc.getDisplay().setSize(12);
        event.npc.getDisplay().setTitle("Fils de Mama");
        event.npc.getDisplay().setModel(model_turtle);
        event.npc.getDisplay().setSkinTexture(texture_turtle);
        event.npc.getAi().setWalkingSpeed(1);
        event.npc.stats.getMelee().setRange(2);
    }
}

