/**
 * Created by harmeko on 19/07/17.
 */

const Discord   = require( 'discord.js' );
const Countdown = require( 'countdown' );

const bot = new Discord.Client();

var games = [];
var comp  = null;

function game( game, name, time, timeStamp ) {
    return {
        slots    : 9,
        timeStamp: timeStamp,
        timeSpan : time,
        creator  : name,
        gameNo   : game
    }

}

function getCountDown( game ) {

    var newDateObj = new Date();
    newDateObj.setTime( game.timeStamp.getTime() + (game.timeSpan * 60 * 1000) );

    if ( newDateObj <= game.timeStamp )
    {
        console.log( "delete" );
        delete games[games.indexOf( game )];
        return false;
    }
    console.log( newDateObj <= game.timeStamp );
    return Countdown( null, newDateObj );
}

function findFunc( element ) {
    return element.gameNo == comp;
}

var reg = new RegExp( '^!lfg.*' );

bot.on( "message", function ( msg ) {
    if ( reg.test( msg.content ) )
    {
        var request = msg.content.split( ' ' );

        if ( request[1] !== undefined )
        {
            if ( request[1] === "add" )
            {
                if ( request[2] !== undefined || !isNaN( request[2] ) )
                {
                    var time = request[3] || 5;
                    games.push( game( request[2], msg.author.username, time, new Date() ) );
                    var count = getCountDown( games[games.length - 1] );

                    if ( count )
                    {
                        msg.channel.send( "```css\n!----- Private game created -----!```\n" +
                            "```http\n HOST : " + games[games.length - 1].creator +
                            "\n Slots available : " + games[games.length - 1].slots +
                            "\n Game code : " + games[games.length - 1].gameNo +
                            "\n Time left : " + count.toString() + "```" );
                    }
                }
                else
                {
                    msg.channel.send( "Game code is incorrect" );
                }
            }

            if ( request[1] === "info" )
            {
                if ( request[2] !== undefined )
                {
                    if ( isNaN( request[2] ) )
                    {
                        return msg.channel.send( "Game code is incorrect" );
                    }

                    comp         = request[2];
                    var instance = games.find( findFunc );
                    if ( instance != undefined )
                    {
                        var count2 = getCountDown( instance );

                        if ( count2 )
                        {
                            msg.channel.send( "```http\n HOST : " + instance.creator +
                                "\n Game code : " + instance.gameNo +
                                "\n Slots available : " + instance.slots +
                                "\n Time left : " + count2.toString() + "```" );
                        }
                    }
                    else
                    {
                        msg.channel.send( "```No games found```" );
                    }
                }
                else
                {
                    games.forEach( function ( instance ) {
                        var count2 = getCountDown( instance );

                        if ( count2 )
                        {
                            msg.channel.send( "```http\n HOST : " + instance.creator +
                                "\n Game code : " + instance.gameNo +
                                "\n Slots available : " + instance.slots +
                                "\n Time left : " + count2.toString() + "```" );
                        }
                    } )
                }

                if ( request[1] === "join" )
                {
                    console.log("JOIN HERE");
                    if ( request[2] !== undefined || !isNaN( request[2] ) )
                    {
                        comp          = request[2];
                        var instance2 = games.find( findFunc );
                        console.log("JOIN", instance2);
                        if ( instance2 != undefined )
                        {
                            var count4 = getCountDown( instance2 );
                            console.log("JOIN", count);
                            if ( count4 )
                            {
                                instance2.slots = instance2.slots - 1;
                                msg.channel.send( "```http\n HOST : " + instance2.creator +
                                    "\n Game code : " + instance2.gameNo +
                                    "\n Slots available : " + instance2.slots +
                                    "\n Time left : " + count4.toString() + "```" );
                            }
                        }
                        else
                        {
                            msg.channel.send( "```Game not found```" );
                        }
                    }
                    else
                    {
                        msg.channel.send( "```Game code is incorrect```" )
                    }
                }
            }
        }
        else
        {
            msg.channel.send( "Request is empty, try `!lfg help` if needed " );
        }
    }
} );

bot.login( "MzM3MTcyMjMxMzc1NDIxNDQw.DFDAgQ.GFatl8TZz-NUvjP1F7L1pjqPDEQ" );