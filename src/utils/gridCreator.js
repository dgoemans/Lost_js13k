// Based on http://bigbadwofl.me/random-dungeon-generator/
var gridCreator = (function () {

    function createBaseGrid(outerArr, innerArr) {
        //first creates the num by num grid with random num of bombs
        // var index = 0;
        var outerList = [];
        for (var x = 0; x < outerArr; x++) {
            var innerList = [];
            for (var y = 0; y < innerArr; y++) {
                innerList.push('X');
            }
            outerList.push(innerList);
        }
        return outerList;
    }

    function generateRooms(sizeX, sizeY, map, rooms)
    {
        var room_count = mathHelper.getRandomNumber(20, 40);
        var min_size = 4;
        var max_size = 12;

        for (var i = 0; i < room_count; i++) {
            var room = {};

            room.x = mathHelper.getRandomNumber(1, sizeX - max_size - 1);
            room.y = mathHelper.getRandomNumber(1, sizeY - max_size - 1);
            room.w = mathHelper.getRandomNumber(min_size, max_size);
            room.h = mathHelper.getRandomNumber(min_size, max_size);

            room.doorsTo = [];

            if (doesCollide(room, -1, rooms)) {
                i--;
                continue;
            }
            room.w--;
            room.h--;

            rooms.push(room);
        }

        // Make corridors
        for (i = 0; i < room_count; i++) {
            var roomA = rooms[i];

            var roomB = findClosestRoom(roomA, rooms);

            if(roomA.doorsTo.contains(roomB))
            {
                continue;
            }

            roomA.doorsTo.push(roomB);

            roomB.doorsTo.push(roomA);

            var pointA = makeDoorPoint(roomA);
            var pointB = makeDoorPoint(roomB);

            map[pointB.y][pointB.x] = 'H';

            map[pointA.y][pointA.x] = 'H';

            while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
                if (pointB.x != pointA.x) {
                    if (pointB.x > pointA.x) pointB.x--;
                    else pointB.x++;
                }
                else if (pointB.y != pointA.y) {
                    if (pointB.y > pointA.y) pointB.y--;
                    else pointB.y++;
                }

                if(map[pointB.y][pointB.x] !== 'H')
                {
                    map[pointB.y][pointB.x] = '_';
                }
            }
        }

        // Make floors
        for (i = 0; i < room_count; i++) {
            var room = rooms[i];
            for (var y = room.y; y < room.y + room.h; y++) {
                for (var x = room.x; x < room.x + room.w; x++) {
                    map[y][x] = '_';
                }
            }
        }

        for (var y = 0; y < sizeY; y++) {
            for (var x = 0; x < sizeX; x++) {
                if (map[y][x] == '_') {
                    for (var yy = y - 1; yy <= y + 1; yy++) {
                        for (var xx = x - 1; xx <= x + 1; xx++) {
                            if (map[yy][xx] == 'X') map[yy][xx] = 'Y';
                        }
                    }
                }
            }
        }
    }

    function makeDoorPoint(room)
    {
        var projection = Math.random() * 4;

        var left = Math.random() > 0.5;

        var x =  mathHelper.getRandomNumber(room.x, room.x + room.w);

        var y = mathHelper.getRandomNumber(room.y, room.y + room.h);

        if(projection < 1)
        {
            x = room.x;
        }
        else if(projection < 2)
        {
            x = room.x + room.w;
        }
        else if(projection < 3)
        {
            y = room.y;
        }
        else if(projection < 4)
        {
            y = room.y + room.h;
        }

        return {
            x: x,
            y: y
        };
    }

    function findClosestRoom(room, rooms) {
        var mid = {
            x: room.x + (room.w / 2),
            y: room.y + (room.h / 2)
        };
        var closest = null;
        var closest_distance = 1000;
        for (var i = 0; i < rooms.length; i++) {
            var check = rooms[i];
            if (check == room) continue;
            var check_mid = {
                x: check.x + (check.w / 2),
                y: check.y + (check.h / 2)
            };
            var distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - check_mid.y) - (room.h / 2) - (check.h / 2));
            if (distance < closest_distance) {
                closest_distance = distance;
                closest = check;
            }
        }
        return closest;
    }

    function doesCollide (room, ignore, rooms) {
        for (var i = 0; i < rooms.length; i++) {
            if (i == ignore) continue;
            var check = rooms[i];
            if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h))) return true;
        }

        return false;
    }

    function createGrid(sizeX, sizeY) {

        return new Promise(function (resolve, reject) {

            var grid = createBaseGrid(sizeX, sizeY);

            var rooms = [];

            generateRooms(sizeX, sizeY, grid, rooms);

            resolve({ grid: grid, rooms: rooms });
        });
    }

    return {
        grid: [],
        create: function () {
            return createGrid(100, 100);

        }
    }

})();
