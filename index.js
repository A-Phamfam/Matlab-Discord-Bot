require('dotenv').config();
const fs        = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const deploy_commands = require('./deploy-commands');
const initCronjobs = require('./src/cronjobs')

// const mustache  = require('mustache');
// const exec  = require('child_process').exec; // for sys calls
// const execSync  = require('child_process').execSync; // for synchronous sys calls
// const request = require('request');
// const util  = require('util');
// const icoct = require('./src/inchat-octave');

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES);

const client = new Client({ intents: myIntents });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, async (...args) => await event.execute(client, ...args));
	}
}

client.login(process.env.BOT_TOKEN).then(initCronjobs);

/*
 * Jobs which are going to be executed every interval (in ms).
 */


// client.on('ready', () => {

//     // Clear out octave workspaces on startup.  Fresh start! 
//     icoct.clearWorkspaces();

//     console.log(`Logged in as ${client.user.tag}!`);

//     client.user.setActivity('Commands: !help', {type: 'PLAYING'})
//         .then(presence => console.log(`Activity set to ${presence.presence.game.name}`))
//         .catch(console.error);
//      // Setup info for the help channel timers
//     help_channel_ids    = ["450928036800364546", "456342124342804481", "456342247189774338", "701876298296983652", "644823196440199179", "601495308140019742", "750745113076170843", "453522391377903636"];
//     help_channel_timers = Array(help_channel_ids.length).fill(null);
//     help_channel_names  = ['matlab-help-1', 'matlab-help-2', 'matlab-help-3', 'matlab-help-4', 'help-channel', 'simulink-help-1', 'simulink-help-2', 'botspam'];


// });




/*
 * Function to initialize cronjobs and start the interval.
 */
// function initCronjobs() {
//     for (let cronjob of cronjobs) {

//         // Check if this cronjob type has a reference in the data JSON, if not, add a blank value
//         if(!cronjob_data.hasOwnProperty(cronjob.name)) {
//             cronjob_data[cronjob.name]  = {entry: {title: ''}};
//         }


//         cronjob.use()
//             .then(entry => {

//                 cronjob.last_checked = new Date();
//                 if(cronjob_data[cronjob.name].entry.title != entry.title) {
//                     // record the entry to the data json
//                     cronjob_data[cronjob.name].entry = entry;

//                     // On boot, submit the news if it's..... new 
//                     client.channels.get(process.env.NEWS_CHANNEL_ID).send(mustache.render(templates[cronjob.template], {result: entry}));
//                 }

//                 // Run cronjob
//                 setInterval(() => {
//                     cronjob.use()
//                         .then(entry => {
//                             cronjob.last_checked = new Date();
//                             // The latest entry hasn't changed, just return out
//                             // if (entry.title === cronjob.entry.title) {
//                             if (entry.title == cronjob_data[cronjob.name].entry.title) {
//                                 return;
//                             }
//                             cronjob_data[cronjob.name].entry = entry;
//                             // Update with the newest entry and post to discord
//                             cronjob.entry = entry;
//                             // Write the cronjob data file out to update the last news IDS
//     		                fs.writeFileSync(cronjob_data_file, JSON.stringify(cronjob_data))
//                             // Send the news 
//                             client.channels.get(process.env.NEWS_CHANNEL_ID).send(mustache.render(templates[cronjob.template], {result: entry}));
//                         })
//                         .catch(error => {
//                             if (error) {
//                                 cronjob.errors.push(error);
//                                 console.log(error);
//                             }
//                         });
//                 }, cronjob.interval);

//                 // Write the cronjob data file out to update the last news IDS
//     		    fs.writeFileSync(cronjob_data_file, JSON.stringify(cronjob_data))

//             })
//             .catch(error => {
//                 if (error) {
//                     cronjob.errors.push(error);
//                     console.log(error);
//                 }
//             });
//     }
// }


// // Define some universal constants
// const lengthMaxBotMessages = 1000; // max message length

// // Define the path variables for inchat octave
// const ic_octave_folder      = './inchat_octave';
// const ic_octave_workspaces  = util.format('%s/workspaces', ic_octave_folder);
// const ic_octave_out_file    = util.format('%s/bot_out.txt', ic_octave_folder);
// const ic_octave_user_code   = util.format('%s/user_code.m', ic_octave_folder);
// const ic_octave_printout    = util.format('%s/user_printout.png', ic_octave_folder);
// const ic_octave_timeout     = 5000; // time in ms

// // Load in illegal use functions for inchat octave and compile them as a regexp
// var illegal_read = fs.readFileSync(util.format('%s/illegal_phrases', ic_octave_folder), 'utf8');
// const illegal_use_regexp = new RegExp('(' + illegal_read.replace(/\n/g, ')|(') + ')');

// var cronjob_data_file = "./storage/cronjob_data.json";
// // Create an empty JSON file if the file isn't present
// if (!fs.existsSync(cronjob_data_file)) {
//     let result = {};
//     fs.writeFileSync(cronjob_data_file, JSON.stringify({}));
// } // Now read in the file
// var cronjob_data = JSON.parse(fs.readFileSync(cronjob_data_file, 'utf8'));


// function shuffle(a) {
//     var j, x, i;
//     for (i = a.length - 1; i > 0; i--) {
//         j = Math.floor(Math.random() * (i + 1));
//         x = a[i];
//         a[i] = a[j];
//         a[j] = x;
//     }
//     return a;
// }

// let buildMinesweeperGrid = function(grid_size, perc_mines) {


//     let grid = Array(grid_size).fill().map(() => Array(grid_size))
//     let num_mines = Math.round(grid_size*grid_size*(perc_mines/100));

//     let num_spaces = grid_size*grid_size;
//     let mines_index = shuffle(Array.from(Array(num_spaces).keys())).slice(0, num_mines);
//     let mine_string = '||` M `||';
//     // Add the mines
//     for(var i = 0; i<grid_size; i++) {
//         for(var j = 0; j <grid_size; j++) {
//             if(mines_index.includes(i*grid_size + j)) {
//                 grid[i][j] = mine_string;
//             }
//         }
//     }

//     var mine_count_this_grid = 0;
//     // Add the numbers
//     for(var i = 0; i<grid_size; i++) {
//         for(var j = 0; j <grid_size; j++) {
//             if(grid[i][j] == mine_string) {
//                 continue;
//             }
//             mine_count_this_grid = 0;
//             for(var k = -1; k<=1; k++) {
//                 if((i-k) < 0 || (i-k) > (grid_size-1) ){
//                     continue;
//                 }
//                 for(var z = -1; z<= 1; z++) {
//                     if( (j-z) < 0 || (j-z) > (grid_size-1)) {
//                         continue;
//                     } else {
//                         if(grid[i-k][j-z] == mine_string) {
//                             mine_count_this_grid++;
//                         }
//                     }
//                 }
//             }
//             grid[i][j] = "||\` "+mine_count_this_grid.toString()+" \`||" ;
//         }
//     }

//     let discordMinesweeperGrid = `Total Spaces: ${num_spaces}  Total Mines: ${num_mines}\n`;
//     // Build the final string
//     for(var i = 0; i<grid_size; i++) {
//         for(var j = 0; j <grid_size; j++) {

//             discordMinesweeperGrid += grid[i][j] + " ";
//         }
//         discordMinesweeperGrid += "\n";
//     }

//     return discordMinesweeperGrid;
// }



// // Write message to log file.  appends new line 
// const writeLog = function(logMsg, logType) {
//     // Open a write stream for the log file. Append to the end
//     var logStream = fs.createWriteStream("log.txt", {flags: 'a'});
//     var theDate = new Date();
//     var dateStr = theDate.toLocaleString();
//     try { // Try to write the log 
//         logStream.write(theDate.toLocaleString() + ": " + logType + " - " + logMsg + "\n");
//     }
//     catch(error) {
//         console.log(error);
//         logStream.write("Error writing log... " + error + "\n")
//     }
//     // End the log
//     logStream.end();
// }

// /*
//  * Function to read out all files in a folder.
//  */
// const readFiles = function (dirname, encoding = 'utf8') {
//     const files = {};
//     fs.readdirSync(dirname).forEach(filename => {
//         files[filename] = fs.readFileSync(dirname + filename, encoding);
//     });
//     return files;
// };

// /*
//  * Read template files and parse them in mustache.
//  */
// const templates = readFiles('./msg/');
// for (let key in templates) {
//     if (templates.hasOwnProperty(key)) {
//         mustache.parse(templates[key]);
//     }
// }



// /*
//  * Object which is a map of command message id -> sent message id
//  */
// let botMessages = [];
// const addBotMessage = function (msgID, channelID, sentID) {
//     botMessages.push({msgID, sentID, channelID});
//     if (botMessages.length > lengthMaxBotMessages) {
//         botMessages = botMessages.slice(1);
//     }
// };
// /*
//  * Function for responding with a rendered message, if the template with the given filename exists.
//  */
// const render = async function (msg, filename, view = {}, opts = {}, deleteMsg = false) {
//     if (templates[filename] !== undefined) {
//         const sent = await msg.channel.send(mustache.render(templates[filename], view), opts).catch(console.log);
//         if (sent !== undefined) {
// 		if (deleteMsg) {
// 			msg.delete(20).catch(console.error);
// 		} 
// 		else {
//             		addBotMessage(msg.id, msg.channel.id, sent.id);
// 		}
//         }
//     }
// };

// /*
//  * Router for all commands detected via regexp.
//  */
// const router = [
// 	{
// 		regexp: /^!run[\s`]/,
// 		use: function(msg, tokens) {
// 		  if(msg.guild === null) {
// 	              msg.channel.send("Use of in chat MATLAB is not allowed in DM's.  Please visit the main channel.");
// 	              return;
// 	          }
// 		}
// 	}, {
        
//         // Will take the last posted message and run any code found within a code block (wrapped in backticks ```)
//         regexp: /^!eval(?:uate)?$/,
//         use: function(msg) {
//             // Define the number of messages the eval call will search back
//             const MSG_SEARCH_LIM = 10;
//             msg.channel.fetchMessages({limit: MSG_SEARCH_LIM+1}) // +1 because we account for the message that called the eval...
//             .then(msgMap => {
//                 let _old_msgs = Array.from(msgMap.values());

//                 // Remove the first message (this is the message that called the eval)
//                 _old_msgs.splice(0,1);

//                 // Loop through the messages from newest to oldest, find a valid code block
//                 for(var i = 0; i < _old_msgs.length; i++) {

//                     let codeMsg = _old_msgs[i]; // check the message
//                     let codeSearchRegexp = /```(?:matlab)?(?:\nmatlab)?((\w|\s|\S)*)(?:```)/; // regexp to parse user code between code blocks
//                     let codeSearchTokens = codeMsg.content.match(codeSearchRegexp);
//                     // Couldn't find a match.  move onto the next message (if there is one) or break out with error message
//                     if(codeSearchTokens == null) { // couldn't find a match
//                         if(i == _old_msgs.length-1) { // end of loop
//                             msg.channel.send("Message doesn't contain a valid code formatting block. (Wrapped in \`\`\`)");
//                             return;
//                         }
//                         continue;
//                     }
//                     let codeToRun = codeSearchTokens[1];
//                     let run_command = util.format("!run```matlab\n%s```", codeToRun);
//                     // Run the code, then delete message immediately
//                     msg.channel.send(run_command).then(msg => msg.delete(20).catch(console.error));
//                     break; // break out of the loop since we found a valid message
//                 }
//             })
//             .catch(err => console.error(err));
//         }
//     },
	
	
// 	{
//     // Inchat octave (remove h for octhelp message)
//     regexp: /^!((?:oct(?=[^h]))|(?:opr)|(?:oup)|(?:orun))/,
//     use: function (msg, tokens) {

//         // Don't allow the use of this function in DM's
//         // if((msg.guild === null) && (msg.author.id != process.env.OWNER_ID)) {
//         if(msg.guild === null) {
//             msg.channel.send("Use of all Octave functions are not allowed in DM's.  Please visit the main channel.");
//             return;
//         }

//         // Figure out the workspace filename for this user
//         var user_id = util.format('%s#%d', msg.author.username, msg.author.discriminator);
//         var user_work_file  = util.format('%s/%s.mat', ic_octave_workspaces, user_id);
                    
//         // Grab the octave operation that the user called
//         var operation = tokens[1];

//         // Control switch for different inchat octave operations
//         switch(operation) {

//             // Typical command.  Run/compute user code
//             case "oct":
//             case "octave":
//             case "orun":
//                 var oct_call_regexp = /!o\w+\s*(?:```matlab)?((?:[\s\S.])*[^`])(?:```)?$/;
//                 var oct_call_tokens = msg.content.match(oct_call_regexp);

//                 // Grab the users commands
//                 var code = oct_call_tokens[1];

//                 // Check for illegal command usage and warn against it...
//                 var found_illegal_match = code.match(illegal_use_regexp);
//                 if(found_illegal_match) {
//                     msg.channel.send("Someone was being naughty <@" + process.env.OWNER_ID + ">");
//                     return;
//                 }

//                 // Write the users code command to a file. continue execution if it works
//                 fs.writeFile(ic_octave_user_code, code, function(err) {

//                     // Check for a file write error
//                     if(err) {
//                         console.log('--------- FILE WRITE ERROR ----------------');
//                         console.log(err);
//                         msg.channel.send('Something went wrong. <@' + process.env.OWNER_ID + '>');
//                         return;
//                     }   

//                     // Format system call for octave CLI
//                     var cmd_format = util.format(`addpath('%s'); bot_runner('%s', '%s')`, ic_octave_folder, ic_octave_out_file, user_work_file);
//                     var octave_call = util.format('octave --no-gui --eval "%s"', cmd_format);

//                     // Call async system octave call with a timeout.  error if it exceeds
//                     exec(octave_call, {timeout: ic_octave_timeout}, function(err, stdout, stderr) {
//                         if(err) { // if there was an error
//                             console.log(err); // log the error
//                             msg.channel.send("Your command timed out.");
//                         } else { // Read the output file
//                             fs.readFile(ic_octave_out_file, 'utf8', function(err, data) {
//                                 if (err) {
//                                     console.log('--------- FILE READ ERROR ----------------')
//                                     console.log(err);
//                                     console.log(ic_octave_out_file);
//                                     msg.channel.send('Something went wrong. <@' + process.env.OWNER_ID + '>');
//                                 } else { // Send the output file message

//                                     // Make sure it doesn't exceed the max message length before sending
//                                     var msg_out = util.format("```matlab\n%s```", data);
//                                     if(msg_out.length >= lengthMaxBotMessages) {
//                                         msg.channel.send("Command executed, but output is too long to display.");
//                                     } else {
//                                         if(operation === 'orun') { // special case to post non formatted 
//                                             msg.channel.send(util.format("%s",data));
//                                         }
//                                         else {
//                                             msg.channel.send(util.format("```matlab\n%s```",data));
//                                         }
//                                     }
//                                 }
//                             });
//                         }
//                     });
//                 }); 
//                 break;

//             // Octave Print.  Print the current users graphic figure saved in the workspace to chat
//             case "opr":
//             case "oprint":
//             case "octaveprint":

//                 var cmd_format = util.format(`addpath('%s'); print_user_gcf('%s', '%s')`, ic_octave_folder, user_work_file, ic_octave_printout);
//                 var octave_call = util.format('octave --no-gui --eval "%s"', cmd_format);

//                 // Call async system octave call with a timeout.  error if it exceeds
//                 exec(octave_call, {timeout: 20000}, function(err, stdout, stderr) {
//                     if(err) { // if there was an error
//                         console.log(err); // log the error
//                         msg.channel.send("You don't have a graphics figure generated.");
//                     } else { // Read the output file
//                         msg.channel.send('', {files: [ic_octave_printout]});
//                     }
//                 });
//                 break;

//             // Octave upload.  Upload attached image to users workspace
//             case "oup":
//             case "oupload":
//             case "octaveupload":
//                 // Check if there were any attachments with this message
//                 if(msg.attachments.size == 0) {
//                     msg.channel.send("Nothing was uploaded.");
//                     return;
//                 }
                
//                 // Valid image type extensions
//                 var valid_filetypes_regexp = /.*\.((?:mat)|(?:png)|(?:jpe?g)|(?:gif)|(?:tif{1,2}))/;

//                 // Grab the message attachment
//                 var msg_attachment = msg.attachments.values().next().value;

//                 // Get the attachment filetype this user uploaded
//                 var attachment_filetype = msg_attachment.filename.match(valid_filetypes_regexp);

//                 // Check if the uploaded attachment is a valid image type
//                 if(attachment_filetype === null) {
//                     msg.channel.send("Invalid image type. Can't upload.");
//                     return;
//                 }
//                 switch(attachment_filetype[1]) {
//                     case "mat":
//                             filetype = "data";
//                         break;

//                     default: 
//                             filetype = "image";
//                         break;
//                 }

//                 // Grab the variable name for the image uplaod
//                 var upload_filename = util.format('%s/user_upload.%s', ic_octave_folder, attachment_filetype[1]);

//                 // Download the image from discord URL, then read into octave and save to the users workspace
//                 download(msg_attachment.url, upload_filename, function(){
//                     var out_msg;
//                     switch(filetype) {
//                         case "data":
//                             var cmd_format = util.format(`addpath('%s'); load_user_data('%s', '%s')`, ic_octave_folder, user_work_file, upload_filename);
//                             out_msg = "Data uploaded to your workspace.";
//                             break;

//                         case "image":
//                             var cmd_format = util.format(`addpath('%s'); load_user_img('%s', '%s')`, ic_octave_folder, user_work_file, upload_filename);
//                             out_msg = "Image saved to your workspace as variable `img`.";
//                             break;
//                     }
//                     // var cmd_format = util.format(`addpath('%s'); load_user_img('%s', '%s')`, ic_octave_folder, user_work_file, upload_filename);
//                     var octave_call = util.format('octave --no-gui --eval "%s"', cmd_format);

//                     // Call async system octave call with a timeout.  error if it exceeds
//                     exec(octave_call, {timeout: 20000}, function(err, stdout, stderr) {
//                         if(err) { // if there was an error
//                             console.log(err); // log the error
//                             msg.channel.send('Something went wrong. <@' + process.env.OWNER_ID + '>');
//                         } else { // Read the output file
//                             msg.channel.send(out_msg);
//                         }
//                     });
//                 });
//                 break;

//             default:
//                 //nothing
//                 break;
//         }

       

//     } // end function
// }, {
//     regexp: /!(m|doc) (.+?)(\s.*)?$/, // E.g. if "!m interp1" or "!doc interp1"
//     use: function (msg, tokens) {
//         const query = tokens[2].trim();
//         searchDocs(query)
//             .then((result) => {
//                 result.toolbox = (result.product.toLowerCase() !== 'matlab') ? ` from ${result.product}` : '';
//                 render(msg, 'doc.md', {result, query});
//             })
//             .catch((error) => {
//                 if (error) {
//                     render(msg, 'doc_error.md', {error, query});
//                 }
//             });
//     }
// }, {
//     regexp: /[[!$](?:`+)((?:[\s\S.])*[^`])(?:`+)$/, // Latex parser 
//     use: function (msg, tokens) {
//         const query = tokens[1].trim();
//         latex(query).then((imgUrl) => {

//             // Download the image from the url (this url is strange, doesn't have an extension ending) then send
//             download(imgUrl, 'img/latex.png', function(){
//                 msg.channel.send('', {file: 'img/latex.png'
//                     }).then((sent) => {
//                         addBotMessage(msg.id, msg.channel.id, sent.id);
//                     }).catch(console.error);
//             });
//             // If there was an error 
//         }).catch((error) => {
//             if (error) {
//                 msg.channel.send('Could not parse latex.');
//             }
//         });
//     }
// }, {
//     regexp: /!blog/,
//     use: function (msg) {
//         getNewestBlogEntry()
//             .then(result => {
//                 render(msg, 'blog.md', {result});
//             })
//             .catch(error => {
//                 if (error) {
//                     render(msg, 'blog_error.md', {error})
//                 }
//             });
//     }
// },  {
//     regexp: /^!minesweeper\s(\d+)(?:\s(\d+))?/,
//     use: function(msg, tokens) {
//         let grid_size = Number(tokens[1]);
//         let perc_mines;
//         if(tokens[2] == null) {
//             perc_mines = 20; // 20 percent by default
//         } else {
//             perc_mines = Number(tokens[2]);
//         }
//         msg.channel.send(buildMinesweeperGrid(grid_size, perc_mines));
//     }
        
// },{
//     regexp: /^!google\s*(.*)$/,
//     use: function(msg, tokens) {
//       var str = tokens[1];
//       var res;
//       // If the user sent issued the command with no message, use the previous message in chat
//       if(!str) {
//         res = msg.channel.messages.array()[msg.channel.messages.size-2].content
//         res = res.replace(/ /g, "+");
//       }
//       else {
//         res = str.replace(/ /g, "+");
//       }
//       a = res;
//       msg.channel.send("http://lmgtfy.com/?q="+res);
// 	  msg.delete(20).catch(console.error);
//     }
// }, {
// 	regexp: /((''')|('''matlab))[\S\s.]*'''/,
// 	use: function(msg) {
// 		var opts = {files: ['./img/backtick_highlight.png']};
//         	render(msg, 'code.md', {query: 'code'}, opts, false);
// 	}
// }, {
//     regexp: /!youtube/,
//     use: function (msg) {
//         getNewestVideo(process.env.YOUTUBE_AUTH_KEY)
//             .then(result => {
//                 render(msg, 'youtube.md', {result});
//             })
//             .catch(error => {
//                 if (error) {
//                     render(msg, 'youtube_error.md', {error})
//                 }
//             });
//     }
// }, {
//     regexp: /!twitter/,
//     use: function (msg) {
//         getNewestTweet()
//             .then(result => {
//                 render(msg, 'twitter.md', {result});
//             })
//             .catch(error => {
//                 if (error) {
//                     render(msg, 'twitter_error.md', {error})
//                 }
//             });
//     }
// }, {
//     regexp: /!cronjob/,
//     use: function (msg) {
//         let result = [];
//         for (let cronjob of cronjobs) {
//             let hours = Math.round((new Date() - cronjob.last_checked) / (3600 * 1e3) * 100) / 100;
//             let interval = Math.round(cronjob.interval / (3600 * 1e3) * 100) / 100;
//             result.push(`${cronjob.name} : Last checked: ${hours} hours ago, Interval: ${interval} hours, Errors: ${cronjob.errors.length}`);
//         }
//         result = result.join('\n\n');
//         render(msg, 'cronjobs.md', {result});
//     }
// }, {
//     regexp: /!(roll|rand)(.*)$/,
//     use: function (msg, tokens) {
//         let {rolled, number} = roll(tokens[2]);
//         render(msg, 'rand.md', {rolled, number});
//     }
// }, {
//     regexp: /!why/,
//     use: function (msg) {
//         render(msg, 'why.md', {
//             result: why(),
//         });
//     }
// }, {
//     regexp: /^!(done|close|finish|answered|exit)/, // allow users to clear the busy status of help channels
//     use: function(msg) {

//         // check if the channel is a help channel first
//         if(help_channel_ids.includes(msg.channel.id)) {
//             var chan = msg.channel;
//             var chan_ind = help_channel_ids.indexOf(chan.id);
    
//             // If the help channel is busy, clear its busy status
//             if(help_channel_timers[chan_ind] != null) {
//                 clearTimeout(help_channel_timers[chan_ind]);
//                 help_channel_timers[chan_ind] = null;
//                 chan.setName(help_channel_names[chan_ind]);
//                 msg.channel.send("Channel is available for another question.")
//                 msg.delete(20).catch(console.error);
//             }
//             else {
//                 // The user executed the command in a question channel that isn't busy
//                 msg.channel.send("Channel is available for another question.")
//                 msg.delete(20).catch(console.error);
//             }
    
//         }
//         else {
//             msg.channel.send("Use this command in a help-channel to clear its busy status once a question is complete.")
//         }
//     }
// }, {
//     regexp: /^!(.+?)( .*)?$/, // E.g. any other message, pass-through (like help.md => "!help", "!help interp1", ...)
//     use: function (msg, tokens) {
//         const command = tokens[1];
    
//         // For an extra layer of configurability, some pass-through messages can have options (dont delete message, add file)
//         var opts = {};
//         var delete_msg = true;
//         switch(command)  {
//             case 'code':
//                 // Send keyboard image with code command
//                 opts = {files: ['./img/backtick_highlight.png']};
//                 break;
                
//             case 'jobs':
//             case 'help':
//             case 'mathelp':
//             case 'octhelp':
//                 // Preferablly keep the message on to see who is looking at jobs
//                 delete_msg = false;
//             default:
//                 // do nothing
//         } // end switch

//         // Render the message with arguments
//         render(msg, command + '.md', {query: command}, opts, delete_msg);
//     }
// }, {
//     regexp: /^!askgood\s*(.*)$/,   // "!askgood @user" shows some asking tips and pings the user
//     use: function (msg, tokens) {
//         const username = tokens[2].trim ;
//         render(msg, 'askgood.md', {username});
//     }
// }];





// client.on('message', msg => {
//     if (msg.author.bot) {
//         return;
//     }

//     let tokens;
//     let commandExecuted = false;

//     let privateMsg = false; // keep track of private messages 

//     // An empty guild indicates this is a private message. Log it
//     if(msg.guild === null) {
//         // Write to log file
//         privateMsg = true;
//         var theMsg = util.format("[%s, %s]: %s", msg.author.id, msg.author.username, msg.content);
//         writeLog(theMsg, "DM");
//     }

//     for (const route of router) {
//         if ((tokens = route.regexp.exec(msg.content)) !== null) {
//             route.use(msg, tokens);
//             commandExecuted = true;
//             break;
//         }
//     }
//     if ((!commandExecuted) && msg.isMentioned(client.user)) {
//         if (/(thank|thx)/.exec(msg.content)) {
//             msg.reply(mustache.render(templates['thanks.md']));
//         }
//         else if (/(hi|hello|good|sup|what's up)/.exec(msg.content)) {
//             msg.reply(mustache.render(templates['greeting.md']));
//         }
//         else {
//             msg.reply(mustache.render(templates['reply.md']));
//         }
//     }

//     if (/(cumsum|cummin|cummax|cumtrapz|cumsec|cumprod)/.exec(msg.content) !== null) {
//         msg.react("💦");
//     }
//     if(/clowns?/.exec(msg.content) !== null) {
//         msg.react("🤡")
//     }

//     // Check if one of the help channels is active. Set its status to busy
//     if((!commandExecuted) && help_channel_ids.includes(msg.channel.id)) {
//         var chan = msg.channel;
//         var chan_ind = help_channel_ids.indexOf(chan.id);

//         if(help_channel_timers[chan_ind] == null) {
//             var busy_chan_str = help_channel_names[chan_ind] + "-BUSY";
//             chan.setName(busy_chan_str).then(newChannel => console.log(`Changing help channel to busy, ${newChannel.name}`)).catch(console.error); 
//             help_channel_timers[chan_ind] = setTimeout(function() {
//                 chan.setName(help_channel_names[chan_ind]);
//                 help_channel_timers[chan_ind] = null;
//             }, 300000);
//         }
//         else {
//             // This channel has a timer established already.  Clear it, then reset it
//             clearTimeout(help_channel_timers[chan_ind]);
//             help_channel_timers[chan_ind] = setTimeout(function() {
//                 chan.setName(help_channel_names[chan_ind]);
//                 help_channel_timers[chan_ind] = null;
//             }, 300000);
//         }

//     }

// });

// // on message delete events, remove the corresponding bot message tighted to the action if there is one
// client.on('messageDelete', async (msg) => {
//     const botMessage = botMessages.find(botMessage => botMessage.msgID === msg.id);
//     if (botMessage !== undefined) {
//         const sent = await client.channels
//             .get(botMessage.channelID)
//             .fetchMessage(botMessage.sentID)
//             .catch(console.log);
//         if (sent !== undefined) {
//             sent.delete().catch(console.log);
//         }
//     }
// });

