//RandomBlock Picker and Daot for his epic video on NPC Tactics for the teleporting\\
/* VARIABLE FUNCTIONS */
var rand = function(a, b){ return Math.random()*(b - a) + a };
//-------------------\\

var ax, az, x, y, z, px, py, pz, flag=0, count=0;
var offset = 3;
var phase = 1;
var maxHP;
var currentHP;
var _oldMeleeRange;
var _oldRangedRange;
var _rangeDelayMin = 35;
var _rangeDelayMax = 50;
var _moveSpeed = 4;
var explosionTrigger = false;
var proj={trailenum:0,PotionEffect:0,effectDuration:5,gravity:0,accelerate:0,glows:0,speed:4.5,power:7,size:10,punch:0,explosiveRadius:0,spins:0,sticks:0,render3d:0,isArrow:0,itemid:"minecraft:stone",itemmeta:1,canBePickedUp:0,scriptedItem:'{id:"minecraft:stone",Count:1b,Damage:0s}'};

var initial_x, initial_y, initial_z;

//Ball: Zawa:Ball

/* ARENA ROOM VARIABLE CONTROL */
var origin = { x:50, y:106, z:250 }
var offsets = { x:0, z:0, y:0, xd:-20, zd:20, yd:-10 };
var area = { x:origin.x + offsets.x, z:origin.z + offsets.z, y:origin.y + offsets.y, xd:origin.x + offsets.xd, zd:origin.z + offsets.zd, yd:origin.y + offsets.yd };
//-------------------\\

function init(event) {
    initial_x = event.npc.getX();
    initial_y = event.npc.getY();
    initial_z = event.npc.getZ();
    phase = 1;
    //event.npc.getDisplay().setSkinUrl("https://fr.namemc.com/texture/6b9ffe331c76cc50.png");
    event.npc.getDisplay().setSize(8);
    event.npc.getDisplay().setTitle("Pirate pas content");
    event.npc.getDisplay().setModel("customnpcs:customnpcclassic");
    event.npc.getDisplay().setSkinUrl("http://royaltycraft.fr/minecraft/skin/hueloco/npcs/ubert/UbertLeNoir.png");
    var resetMinions = event.npc.world.getNearbyEntities(event.npc.getX(), event.npc.getY(), event.npc.getZ(), 64, 2);
    for(var i = 0; i < resetMinions.length; i++) { if(resetMinions[i].display.name == "Pirate d'Ubert") { resetMinions[i].despawn(); } }
    explosionTrigger = false;
    event.npc.timers.clear();
    event.npc.display.setVisible(0);
    event.npc.setHealth(event.npc.getMaxHealth() / 2);
    event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound Ubert_Spawn master @p");
//    event.npc.world.broadcast("<Ubert the Banished> \u00A7cAssuming control!");
    event.npc.getAi().setWalkingSpeed(_moveSpeed);
    event.npc.stats.getMelee().setRange(2);
    event.npc.stats.getRanged().setRange(12);
    event.npc.getAi().setNavigationType(0);
    event.npc.stats.getRanged().setDelay(_rangeDelayMin, _rangeDelayMax);

    
    event.npc.getAi().setTacticalType​(2); //SURROUND
    event.npc.getAi().setRetaliateType​(0);
    event.npc.getAi().setLeapAtTarget​(true);


    cleanup(event);
}

function kill(event)
{
    event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound Ubert_KilledTarget master @p");
//    event.npc.world.broadcast("<Ubert the Banished> \u00A7cI sense your weakness!");
    var playersAlive = event.npc.world.getNearbyEntities(event.npc.getX(), event.npc.getY(), event.npc.getZ(), 200, EntityType_PLAYER);
    if (playersAlive == 0){ totalReset(event); }
}

function damaged(event) 
{
    maxHP = event.npc.getMaxHealth(); 
    currentHP = event.npc.getHealth();
    var currentPercent = getWholePercent(currentHP, maxHP);
    //Phase 1 Tactics - Evasion and Teleport
    if (event.source != null)
    {
        if ((event.source.getType() == 1) && phase == 1)
        {
      	    event.npc.display.setVisible(1);
            flag=1;
            event.npc.getTempdata().put("player",event.source);  
        }
        //Change to Phase 2\\
        if ((currentPercent <= 75) && (phase == 1)) { phaseChange(event); }
        //Change to Phase 3\\
        if ((currentPercent <= 50) && (phase == 2)) { phaseChange(event); }
        //Change to Phase 4\\
        if ((currentPercent <= 25) && (phase == 3)) { phaseChange(event); }
    }
}

function died(event) {
    event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound Ubert_Died master @p");
//    event.npc.world.broadcast("<Ubert the Banished> \u00A7cI will find you again...");
    for (var i = 0; i < 6; i++) {
        if (event.npc.timers.has(i)) {
            event.npc.timers.stop(i);
        }
    }
    event.npc.timers.clear();
    cleanup(event);
}

var first_p2;
function phaseChange(event) {
    phase++
    event.npc.display.setVisible(0);
    event.npc.executeCommand('/execute @p[c=4] ~ ~ ~ title @p title {"text":"Ubert: Phase '+phase+'!","color":"red"}');
    switch(phase) {
    case 2: 
        first_p2 = true;
        event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound Ubert_Phase2 master @p");
//        event.npc.world.broadcast("<Ubert the Banished> \u00A7cOur power is unmatched!");
        if (!event.npc.timers.has(2)) {
            event.npc.timers.start(2, 1, false);
        }
        break;
    case 3:
        event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound Ubert_Phase3 master @p");
//        event.npc.world.broadcast("<Ubert the Banished> \u00A7cProgress cannot be halted!");
        if (!event.npc.timers.has(3)) {
            event.npc.timers.start(3, 1, false);
        }
        break;
    case 4:
//        event.npc.world.broadcast("<Ubert the Banished> \u00A7cDestroying this body gains you nothing!");
        event.npc.getDisplay().setTitle("Esprit d'Ubert");
        event.npc.getDisplay().setSkinTexture("aoa3:textures/entities/mobs/abyss/apparition.png");
        event.npc.getDisplay().setModel("aoa3:apparition");
        
        playDeadScene(event); //Dead scene
            
        break;                    
    }
}

function tick(event)  {
    if(phase == 4) {    //FINAL
        return; // DEAD ANIM
    }
    //Phase 1 - Utilizes Evasion Tactics
    if ((flag) && (phase == 1)) {   	 
        az = offset*Math.sin((event.npc.getTempdata().get("player").getRotation()+90)*Math.PI/180);  
        ax = offset*Math.cos((event.npc.getTempdata().get("player").getRotation()+90)*Math.PI/180);
        x = event.npc.getTempdata().get("player").getX()-ax;
        z = event.npc.getTempdata().get("player").getZ()-az;
        y = event.npc.getTempdata().get("player").getY();
        if (!event.npc.world.getBlock(x,y,z)&&!event.npc.world.getBlock(x,y+1,z))  {  
            event.npc.setPosition(x,y,z);
            count++;
            if (count==20) {
                flag=0;
                count=0;
            }
            event.npc.display.setVisible(0);
        }  else {
            event.npc.display.setVisible(0);
        } 	 

        if(first_p2) {
            first_p2 = false;
            event.npc.timers.start(1, 1, false);
        } else {
            event.npc.timers.start(1, 300, true);
        }
    }
    

    //Phase 2 - Utilize Explosions
    if (phase == 2) {
        event.npc.getDisplay().setTitle("Pirate vraiment pas content");
        event.npc.getDisplay().setSize(10);
        if (!event.npc.timers.has(2)) {
            event.npc.timers.start(2, 300, true);
        }
    }

    
    if (phase == 3) {
        event.npc.getDisplay().setSize(12);
        event.npc.getDisplay().setModel("customnpcs:customnpc64x32");
        event.npc.getDisplay().setSkinUrl("http://royaltycraft.fr/minecraft/skin/hueloco/npcs/ubert/Ubert_p2_Skeleton.png");
        event.npc.getDisplay().setTitle("Abomination d'Ubert");
        if (!event.npc.timers.has(3))  {
            event.npc.timers.start(3, 300, true);
        } 
    }

//
//    //Phase 4 - Break Celing
//    if (phase == 4)
//    {
//        if (!event.npc.timers.has(5))
//        {
//            event.npc.timers.start(5, 220, true);
//        }
//    }
}



function playerShoot(e,t){function r(e,t){t*=Math.PI/1;var r=Math.cos(t),a=Math.sin(t);return new Array(Math.round(1*(e[0]*r-e[1]*a))/1,Math.round(1*(e[0]*a+e[1]*r))/1)}var a=e.player,i=Number(a.getPitch().toFixed(0)),o=Number(a.getRotation().toFixed(0));0>o?(-3>o&&(o%=3),o=3+o):o>3&&(o%=3);var n=r([0,1],o),c=n[0],s=n[1],i=i/1*-1,d=i,p=1-Math.abs(d);d=0==t.gravity?.0*d:d;var l=.07*t.speed*c*p,u=.07*t.speed*s*p,y='{id:"customnpcs:customnpcprojectile",ownerName:"'+e.player.UUID+'",Pos:['+e.player.x+"d,"+(e.player.y+1.6)+"d,"+e.player.z+"d],PotionEffect:"+t.PotionEffect+",isArrow:"+t.isArrow+"b,punch:"+t.punch+",explosiveRadius:"+t.explosiveRadius+",Item:"+t.scriptedItem+",damagev2:"+t.power+"f,trailenum:"+t.trailenum+",Spins:"+t.spins+"b,glows:"+t.glows+"b,accelerate:"+t.accelerate+"b,direction:["+l+"d,"+l+"d,"+l+"d],Motion:["+l+"d,"+l+"d,"+l+"d],velocity:"+t.speed+",canBePickedUp:"+t.canBePickedUp+"b,size:"+t.size+",Sticks:"+t.sticks+"b,gravity:"+t.gravity+"b,effectDuration:"+t.effectDuration+",Render3D:"+t.render3d+"b}",b=e.player.world.createEntityFromNBT(e.API.stringToNbt(y));return e.player.world.spawnEntity(b),b}

function calculateDegrees(x, z, radius, degree) {
    x = x + (radius * Math.cos(degree))
    y = y + (radius * Math.sin(degree))
    return [x,y]
}

var playing_last_phase = true;
function timer(event)  { 
    if (event.id == 1)  {
        runPhase1Mechanics(event);  // Bombs Fall

    } else if (event.id == 2) {
        runPhase2Mechanics(event); //Minions summoning

    } else if (event.id == 3) {
        runPhase3Mechanics(event); //Dagger tourbillol

    } else if (event.id == 4 && playing_last_phase) {
        playing_last_phase = false;
        playDeadScene(event); //Dead scene

    } else if (event.id == 5) { //Final Phase Ceiling Collapse Timer
        var targetBlock = chooseRandomBlock(event.npc.world, area.x, area.xd , area.z , area.zd, area.y)
        targetBlock.remove();
        event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound Ubert_BreakRoof master @p");
//        event.npc.world.broadcast("<Ubert the Banished> \u00A7cYou are bacteria!");
    }
}



// Bomb falling
function runPhase1Mechanics(event) {
    
    event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound Ubert_Phase1_Special master @p");        
    event.npc.getAi().setNavigationType(0);

    var x = event.npc.getX();
    var z = event.npc.getZ();
    var y = event.npc.getY();


    event.npc.navigateTo(x, y, z, 5);
    event.npc.setPosition(x, y, z);


    var minionCount = randomIntFromInterval(4, 8);
    for (var i = 0; i < minionCount; i++) {
       var ubertMinion = event.API.getClones().get(1, "Boulet de Canon d'Ubert", event.npc.getWorld());
       ubertMinion.setHome(x, y + 10, z);
       ubertMinion.setPosition(x + randomIntFromInterval(-10, 10), y+ 10, z + randomIntFromInterval(-10, 10));
       ubertMinion.spawn(); 
    }



    if(!event.npc.timers.has(1)) {
        event.npc.timers.start(1, 300, true);
    } 
    explosionTrigger = true;
    event.npc.getAi().setWalkingSpeed(3)
}


function runPhase2Mechanics(event) {
    var ubertBoss = event.npc;
    ubertBoss.executeCommand("/execute @p[c=4] ~ ~ ~ playsound Ubert_Phase2_Special master @p");
//        ubertBoss.world.broadcast("<Ubert> \u00A7cSentient beings need never feel pain!");
    x = event.npc.getX();
    z = event.npc.getZ();
    y = event.npc.getY();


    var minionCount = randomIntFromInterval(1, 3);
    for (var i = 0; i < minionCount; i++) {
        //if block != air pass)
       var ubertMinion = event.API.getClones().get(1, "Pirate d'Ubert", event.npc.getWorld());
       ubertMinion.setHome(ubertBoss.x, ubertBoss.y + 3, ubertBoss.z + 3);
       ubertMinion.setPosition(x + randomIntFromInterval(3, 8), y+ 3, z + randomIntFromInterval(2, 4));
       ubertMinion.spawn(); 
    }
    
}



function runPhase3Mechanics(event){
    event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound Ubert_Phase3_Special master @p");
//    event.npc.world.broadcast("<Ubert the Banished> \u00A7cAssuming control!");

    event.npc.getAi().setWalkingSpeed(0);
    event.npc.stats.getMelee().setRange(4);
    event.npc.stats.getRanged().setRange(20);
    event.npc.getAi().setNavigationType(3);
    event.npc.stats.getRanged().setDelay(10, 20);

    //event.npc.setImmune(true);

    x = event.npc.getX();
    z = event.npc.getZ();
    y = event.npc.getY();
    var item = event.npc.getWorld().createItem("variedcommodities:stone_dagger", 25, 5);
    
    /*
    for(var degree = 0; degree < 360; degree = degree + 1) {


//        var res = calculateDegrees(x, z, 10, degree);
//        var tmp_x = res[0];
//        var tmp_z = res[1];
        
    //    event.npc.shootItem​(x + radius * Math.cos(0), y, z + Math.cos(0), item, 100);
    //    event.npc.shootItem​(x + radius * Math.cos(90), y, z + Math.cos(90), item, 100);
    //    event.npc.shootItem​(x + radius * Math.cos(180), y, z + Math.cos(180), item, 100);
    //    event.npc.shootItem​(x + radius * Math.cos(270), y, z + Math.cos(270), item, 100);
        event.npc.setRotation(degree);
        var radius = 10;

        event.npc.shootItem​(x + radius * Math.cos(degree), y, z + Math.sin(degree), item, 100);

    }
    */

        
    // http://www.kodevelopment.nl/customnpcs/api/1.12.2/constant-values.html#noppes.npcs.api.constants.EntityType.ANY
    var entitiesList = event.npc.world.getNearbyEntities(event.npc.getPos(), 32, -1); //1 player -1 any
    //event.npc.getRanged().setSpeed(1);
    for(var i = 0; i < entitiesList.length; i++) {
        for(var amount = 0; amount < 3; amount++) {
            event.npc.shootItem​(entitiesList[i], item, 35);
        }
    }



    
    event.npc.getAi().setWalkingSpeed(_moveSpeed);
    event.npc.stats.getMelee().setRange(2);
    event.npc.stats.getMelee().setKnockback(10);
    event.npc.stats.getRanged().setRange(12);
    event.npc.getAi().setNavigationType(0);
    event.npc.stats.getRanged().setDelay(_rangeDelayMin, _rangeDelayMax);
    //event.npc.setImmune(false);

}



function playDeadScene(event) {

    event.npc.executeCommand("/execute @p[c=4] ~ ~ ~ playsound Ubert_PhaseFinal master @p");

    event.npc.getAi().setNavigationType(1); //1 flying 0 ground 2 swimming
    event.npc.getAi().setWalkingSpeed(1);
    event.npc.getAi().setTacticalType​(6); //SURROUND
    event.npc.getAi().setRetaliateType​(3);
    event.npc.getAi().setLeapAtTarget​(false);

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

    


    //event.npc.navigateTo(x, y + 10, z, 1);

    var ubertMinion1 = event.API.getClones().get(1, "Tsuka", event.npc.getWorld());
    ubertMinion1.getAi().setTacticalType(6); //NONE
    ubertMinion1.getAi().setRetaliateType​(3);
    ubertMinion1.getAi().setNavigationType(1); //1 flying 0 ground 2 swimming
    ubertMinion1.setHome(x, y+5, z);
    ubertMinion1.setPosition(x + randomIntFromInterval(3, 8) + 5, y + 5, z + randomIntFromInterval(2, 4));
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
    event.npc.navigateTo(x, y + 5, z, 4);
    event.npc.setHome(initial_x, initial_y, initial_z);
}










//----------------------------UTILITY FUNCTIONS----------------------------\\
function randomGenWhole(){ return Math.floor(Math.random() * 20); }
function randomIntFromInterval(min,max){ return Math.floor(Math.random()*(max-min+1)+min); }
function getWholePercent(percentFor, percentOf){ return Math.floor(percentFor/percentOf * 100) }
function chooseRandomBlock(world, x1, x2, z1, z2, y) { x = rand(x1, x2); z = rand(z1, z2); return world.getBlock(x, y, z); }


function totalReset(event) {
    phase = 1;
    var resetMinions = event.npc.world.getNearbyEntities(event.npc.getX(), event.npc.getY(), event.npc.getZ(), 32, 2);
    for(var i = 0; i < resetMinions.length; i++) { 
        if(resetMinions[i].display.name == "Pirate d'Ubert") { 
            resetMinions[i].despawn(); 
        } 
    }
    explosionTrigger = false;
    event.npc.display.setVisible(0);
    event.npc.setHealth(event.npc.getMaxHealth());
    event.npc.getAi().setWalkingSpeed(_moveSpeed);
    event.npc.stats.getMelee().setRange(2);
    event.npc.stats.getRanged().setRange(12);
    event.npc.getAi().setNavigationType(0);
    event.npc.stats.getRanged().setDelay(_rangeDelayMin, _rangeDelayMax);
    cleanup(event);
}

function cleanup(event) {
    /*repair glass*/
    /*two rows on +/- X*/
    var glassPlane = ''+(area.x-1)+' '+area.y+' '+area.z+' '+(area.xd+1)+' '+area.y+' '+area.zd;
    event.npc.executeCommand('/fill '+glassPlane+' tconstruct:clear_glass 0 replace');
    var lavaArea = ''+area.x+' '+area.y+' '+area.z+' '+area.xd+' '+area.yd+' '+area.zd;
    event.npc.executeCommand('/fill '+lavaArea+' minecraft:air 0 replace minecraft:lava');
    event.npc.executeCommand('/fill '+lavaArea+' minecraft:air 0 replace minecraft:flowing_lava');
}