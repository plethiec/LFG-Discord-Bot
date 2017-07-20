/**
 * Created by harmeko on 19/07/17.
 */

const Discord   = require( 'discord.js' );
const Countdown = require( 'countdown' );

const bot = new Discord.Client();

var games = [];
var comp  = null;
// var LFGchannel = null;
// https://discordapp.com/oauth2/authorize?client_id=337172231375421440&scope=bot&permissions=3072

function game( game, name, time, timeStamp ) {
    return {
        slots    : 9,
        timeStamp: timeStamp,
        timeSpan : time,
        creator  : name,
        gameNo   : game,
        members  : []
    }

}

function getCountDown( game ) {

    var newDateObj = new Date();
    newDateObj.setTime( game.timeStamp.getTime() + (game.timeSpan * 60 * 1000) );

    return Countdown( null, newDateObj );
}

// function findFunc( element ) {
//     return element.gameNo == comp;
// }

var reg    = new RegExp( '^!lfg.*' );
var regNum = new RegExp( '[0-9]{6}' );

bot.on( "ready", function () {
    console.log( "ready." );
    bot.user.setGame( 'Black Survival' );
} );

bot.on( "message", function ( msg ) {
        if ( reg.test( msg.content ) )
        {
            var request = msg.content.split( ' ' );

            if ( request[1] !== undefined )
            {
                if ( request[1] === "join" )
                {
                    // if ( request[2] !== undefined && regNum.test( request[2] ) )
                    // {
                    //     comp          = request[2];
                    //     var instance2 = games.find( findFunc );
                    var instance2 = games[0];
                    if ( instance2 != undefined )
                    {
                        if ( instance2.members.indexOf( msg.author.username ) != -1 )
                        {
                            return msg.channel.send( "```You already are in the game.```" )
                        }

                        games[0].members.push( msg.author.username );

                        var count4 = getCountDown( instance2 );
                        if ( instance2.slots > 0 )
                        {
                            instance2.slots = instance2.slots - 1;
                        }

                        if ( instance2.slots == 0 )
                        {
                            instance2.slots = instance2.slots - 1;
                        }
                        return msg.channel.send( "```http\n HOST : " + instance2.creator +
                            "\n Game code : " + instance2.gameNo +
                            "\n Slots available : " + instance2.slots +
                            "\n Time left : " + count4.toString() + "```" );
                    }
                    else
                    {
                        return msg.channel.send( "```Game not found```" );
                    }
                    // }
                    // else
                    // {
                    //     return msg.channel.send( "```Game code is incorrect```" )
                    // }
                }

                if ( request[1] === "leave" )
                {

                    // if ( request[2] !== undefined && regNum.test( request[2] ) )
                    // {
                    //     comp          = request[2];
                    // var instance2 = games.find( findFunc );
                    var instance2 = games[0];
                    if ( instance2 != undefined )
                    {
                        if ( instance2.members.indexOf( msg.author.username ) == -1 )
                        {
                            return msg.channel.send( "```You are not in the game.```" )
                        }

                        if ( msg.author.username == instance2.creator )
                        {
                            return msg.channel.send( "```The creator can't leave a game, DESTROY the game instead.```" )
                        }

                        games[0].members.splice( games[0].members.indexOf( msg.author.username ), 1 );

                        var count4 = getCountDown( instance2 );
                        if ( instance2.slots < 9 )
                        {
                            instance2.slots = instance2.slots + 1;
                        }
                        return msg.channel.send( "```http\n HOST : " + instance2.creator +
                            "\n Game code : " + instance2.gameNo +
                            "\n Slots available : " + instance2.slots +
                            "\n Time left : " + count4.toString() + "```" );
                    }
                    else
                    {
                        return msg.channel.send( "```Game not found```" );
                    }
                    // }
                    // else
                    // {
                    //     return msg.channel.send( "```Game code is incorrect```" )
                    // }
                }

                if ( request[1] === "DESTROY" )
                {
                    if ( msg.author.username === games[0].creator )
                    {
                        games = [];
                        return msg.channel.send( "Yes master. \n ```Game destroyed```" )
                    }
                    else
                    {
                        return msg.channel.send( "I don't think so." )
                    }
                }

                if ( request[1] === "help" )
                {
                    return msg.channel.send(
                        "```css\nParameters with () are mandatory, parameters with {} are optional but don't put () or {} in your message ;)\n" +
                        "\n[!lfg add (game code) {minutes you will wait before starting}]" +
                        "\nwhere minutes have to be a number like '!lfg add 000000' for the default 5 minutes or '!lfg add 000000 6' for 6 minutes\n" +
                        "\n[!lfg info]" +
                        "\nfor informations about the current game \n" +
                        "\n[!lfg join] \nto indicate you're joining the game \n" +
                        "\n[!lfg leave] \nto indicate you're leaving the game\n" +
                        "\n[!lfg DESTROY]\ndestroys the current game if you are the creator. It's in capital letters. It's not a mistake, it's your ALMIGHTY POWER AS A CREATOR!```" +
                        " © Harmeko" );
                }

                if ( request[1] === "add" )
                {
                    if ( request[2] !== undefined && regNum.test( request[2] ) )
                    {
                        if ( games.length >= 1 )
                        {
                            return msg.channel.send( "another game is already starting" );
                        }
                        var time = 5;
                        if ( request[3] !== undefined && !isNaN( request[3] ) )
                        {
                            time = request[3];
                        }

                        if ( time >= 60 )
                        {
                            return msg.channel.send( "```You really think anyone's gonna wait this long? Niva, stop!```" )
                        }

                        games.push( game( request[2], msg.author.username, time, new Date() ) );
                        var index = games.length - 1;
                        var count = getCountDown( games[index] );
                        games[0].members.push( msg.author.username );

                        setInterval( function () {
                            games.splice( 0, 1 );
                        }, time * 60 * 1000 );

                        msg.guild.channels.find( "name", "test-one" ).send(
                            "```css\n!----- Private game created -----!```\n" +
                            "```http\n HOST : " + games[index].creator +
                            "\n Slots available : " + games[index].slots +
                            "\n Game code : " + games[index].gameNo +
                            "\n Time left : " + count.toString() + "``` \n" +
                            "@LFG " + games[index].gameNo );

                        return msg.channel.send( "```css\n!----- Private game created -----!```\n" +
                            "```http\n HOST : " + games[index].creator +
                            "\n Slots available : " + games[index].slots +
                            "\n Game code : " + games[index].gameNo +
                            "\n Time left : " + count.toString() + "```" );
                    }
                    else
                    {
                        return msg.channel.send( "Game code is incorrect" );
                    }
                }

                if ( request[1] === "info" )
                {
                    // if ( request[2] !== undefined )
                    // {
                    // if ( !regNum.test( request[2] ) )
                    // {
                    //     return return msg.channel.send( "Game code is incorrect" );
                    // }

                    // comp         = request[2];
                    // var instance = games.find( findFunc );
                    var instance = games[0];
                    if ( instance != undefined )
                    {
                        var count2 = getCountDown( instance );

                        return msg.channel.send( "```http\n HOST : " + instance.creator +
                            "\n Game code : " + instance.gameNo +
                            "\n Slots available : " + instance.slots +
                            "\n Time left : " + count2.toString() +
                            "\n Members : " + instance.members.join( " , " ) + "```" );
                    }
                    else
                    {
                        return msg.channel.send( "```No games found```" );
                    }
                }
                else
                {
                    games.forEach( function ( instance ) {
                        var count2 = getCountDown( instance );

                        return msg.channel.send( "```http\n HOST : " + instance.creator +
                            "\n Game code : " + instance.gameNo +
                            "\n Slots available : " + instance.slots +
                            "\n Time left : " + count2.toString() + "```" );
                    } )
                }

            }
            else
            {
                return msg.channel.send( "Request is empty, try `!lfg help` if needed " );
            }
        }
    }
)
;

bot.login( "MzM3MTcyMjMxMzc1NDIxNDQw.DFDAgQ.GFatl8TZz-NUvjP1F7L1pjqPDEQ" );