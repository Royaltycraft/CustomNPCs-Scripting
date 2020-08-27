
var last_y = -1;

function init(event){
    event.npc.getStats().setHideDeadBody(true);
}


function tick(event){
    var current_y = event.npc.getY();
    if(last_y == current_y) {
        event.npc.kill();
    } else {
        current_y = last_y;
    }
}


function collide(event) {
    event.npc.kill();
}

function died(event){
    var x = event.npc.getX();
    var z = event.npc.getZ();
    var y = event.npc.getY();
    event.npc.world.explode(x, y, z, 5, true, false);
}