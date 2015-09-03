var _ = require('underscore'),
    moment = require('moment'),
    clone = require('clone'),
    draftTime = moment("2015-09-04 01:45 +0000", "YYYY-MM-DD HH:mm Z"),
    now = moment(),
    second = draftTime.diff(now, 'seconds'),
    draftSpeed = 60,
    tempDraft = [],
    currDraft = [],
    mode = 'pre',
    teams = [
        '100 Yard Punt - (Chase)',
        'Big Dick Zimmerman (Brian)',
        'Glover Mother Lovers (Zach)',
        'Get to da\' choppa\' (Mike W)',
        'Gronkey Kong 64 (Jim)',
        'TowelsCarryEbola (Ku)',
        'TheMinisterofDefense (Collin)',
        'Bukkake Thunderstorm (Mike S)',
        'Primetime (Rob)',
        'JJ S.W.A.T.T. (Peter)',
        'Zak\'s Heinous Hats (Vijay)',
        'Cheesedick Academy (Greg)'
    ];


module.exports = function(io) {

    // confirm draft hasn't happened
    if (now.isAfter(draftTime)) {
        throw Error('Draft Time is in the past.');
    }

    // create interval
    var interval = setInterval(tick, 1000);

    io.on('connection', function(socket) {

        socket.emit('order', {
            order: currDraft
        });

    });

    // tick
    function tick() {
        second--;
        if (mode === 'pre') {
            if (second > 0) {
                preDraftTick();
            }
            else {
                startDraft();
            }
        }
        else {
            draftTick();
        }
    }

    // pre draft
    function preDraftTick() {
        if (tempDraft.length === 0) {
            tempDraft = _.shuffle(clone(teams));
            currDraft = [];
        }

        var duration;

        if (second > 60) {
            duration = moment.duration(second, 'seconds').humanize();
        }
        else {
            duration = second + ' seconds';
        }

        io.emit('tick', {
            type: 'pre',
            seconds: duration
        });

        var selection = tempDraft.pop();
        currDraft.push(selection);

        io.emit('selection', {
            number: tempDraft.length + 1,
            team: selection
        });
    }

    // real draft
    function startDraft() {
        mode = 'draft';
        second = draftSpeed;
        tempDraft = _.shuffle(clone(teams));
        currDraft = [];

        io.emit('clear');
    }

    function draftTick() {
        if (tempDraft.length === 0) {
            clearInterval(interval);
            interval = null;

            mode = 'final';

            io.emit('tick', {
                type: 'final',
                seconds: 0
            });
        }
        else {

            io.emit('tick', {
                type: 'draft',
                seconds: second + ' seconds'
            });

            if (second === 0) {
                var selection = tempDraft.pop();
                currDraft.push(selection);

                io.emit('selection', {
                    number: tempDraft.length + 1,
                    team: selection
                });

                second = draftSpeed;
            }
        }
    }

};
