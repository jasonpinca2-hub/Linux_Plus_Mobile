(function(){'use strict';
var STATS='linuxplus-v65-objective-stats',LOGGED='linuxplus-v65-logged-checks';
var COMMANDS=[
['getent','getent DATABASE [KEY]','Query NSS databases such as passwd, group, and hosts.',['getent passwd accounting','getent group wheel'],'Use it when the question asks for account fields from the configured identity sources.'],
['id','id [USER]','Display UID, GID, and group memberships.',['id accounting','id -nG user'],'Unlike getent passwd, id focuses on numeric identity and memberships.'],
['useradd','useradd [OPTIONS] USER','Create a local user account.',['sudo useradd -m student','sudo useradd -s /bin/bash analyst'],'Remember -m creates the home directory.'],
['usermod','usermod [OPTIONS] USER','Modify an existing user account.',['sudo usermod -aG wheel user','sudo usermod -s /sbin/nologin user'],'Exam trap: -G without -a replaces supplementary groups.'],
['passwd','passwd [OPTIONS] [USER]','Set, lock, unlock, or inspect password status.',['sudo passwd user','sudo passwd -l user'],'-l locks password authentication; it does not necessarily terminate existing sessions.'],
['chage','chage [OPTIONS] USER','Manage password-aging information.',['sudo chage -l user','sudo chage -M 90 user'],'Use -l to list aging settings.'],
['chmod','chmod MODE FILE','Change permission bits.',['chmod 755 script.sh','chmod u+x deploy.sh'],'755 gives owner rwx and group/others r-x.'],
['chown','chown OWNER[:GROUP] FILE','Change owner and optionally group.',['sudo chown alice report.txt','sudo chown -R web:web /srv/site'],'chmod changes permissions; chown changes ownership.'],
['chgrp','chgrp GROUP FILE','Change group ownership.',['sudo chgrp developers project','sudo chgrp -R apache /var/www'],'Use chgrp when only the group must change.'],
['umask','umask [MASK]','Control default permission bits removed at creation.',['umask 022','umask 027'],'Typical base permissions: files 666, directories 777, then subtract the mask.'],
['setfacl','setfacl [OPTIONS] FILE','Set POSIX ACL entries.',['setfacl -m u:alice:rw file','setfacl -m d:g:dev:rwx shared/'],'Default ACLs apply to newly created children.'],
['getfacl','getfacl FILE','Display POSIX ACLs.',['getfacl report.txt','getfacl -R shared/'],'Use this to verify effective ACL entries.'],
['find','find PATH TESTS ACTIONS','Search the live filesystem.',['find /var/log -name "*.log"','find /home -type f -mtime -7'],'Newly created file clues usually point to find, not locate.'],
['locate','locate PATTERN','Search a prebuilt filename database.',['locate sshd_config','locate "*.service"'],'Fast, but results can be stale until updatedb runs.'],
['grep','grep [OPTIONS] PATTERN [FILE]','Search text for matching lines.',['grep -R "PermitRootLogin" /etc/ssh','journalctl | grep failed'],'-i ignores case; -R searches recursively.'],
['awk','awk PROGRAM [FILE]','Process records and fields.',['awk -F: \'{print $1}\' /etc/passwd','df -h | awk \'NR>1 {print $5,$6}\''],'Think columns and fields.'],
['sed','sed [OPTIONS] SCRIPT [FILE]','Transform text streams.',['sed \'s/old/new/g\' file','sed -n \'1,10p\' file'],'Without -i, sed normally writes transformed output to stdout.'],
['cut','cut OPTION FILE','Extract selected fields or character positions.',['cut -d: -f1 /etc/passwd','cut -c1-8 file'],'Use -d with -f for delimited fields.'],
['sort','sort [OPTIONS] FILE','Sort lines.',['sort names.txt','sort -n scores.txt'],'-n selects numeric sorting.'],
['uniq','uniq [OPTIONS] FILE','Filter adjacent duplicate lines.',['sort file | uniq','sort file | uniq -c'],'uniq only detects adjacent duplicates, so sort first.'],
['tee','tee [OPTIONS] FILE','Write stdin to both stdout and files.',['command | tee output.txt','command | sudo tee /etc/file'],'Useful when shell redirection would not inherit sudo.'],
['cp','cp [OPTIONS] SOURCE DEST','Copy files or directories.',['cp file backup/','cp -a source/ backup/'],'-a preserves metadata and recursively copies.'],
['mv','mv SOURCE DEST','Move or rename files.',['mv old new','mv file /tmp/'],'Within one filesystem, mv generally renames directory entries.'],
['ln','ln [-s] TARGET LINK_NAME','Create hard or symbolic links.',['ln file hardlink','ln -s /opt/app current'],'Hard links cannot cross filesystems; symbolic links can.'],
['tar','tar [OPTIONS] ARCHIVE FILES','Create, list, or extract archives.',['tar -czf backup.tgz /etc','tar -xvf archive.tar'],'c=create, x=extract, t=list, f=archive filename.'],
['rsync','rsync [OPTIONS] SOURCE DEST','Synchronize files efficiently.',['rsync -av source/ backup/','rsync -avz dir/ host:/backup/'],'A trailing slash changes whether the source directory itself or its contents are copied.'],
['dd','dd if=INPUT of=OUTPUT [OPTIONS]','Copy raw blocks of data.',['sudo dd if=/dev/sda of=disk.img bs=4M status=progress','dd if=/dev/zero of=test bs=1M count=100'],'Double-check if= and of=; reversing them can destroy data.'],
['dnf','dnf [OPTIONS] COMMAND','Manage RPM packages and repositories.',['sudo dnf install httpd','dnf history'],'dnf resolves dependencies; rpm works directly with package files.'],
['rpm','rpm [OPTIONS] PACKAGE','Query or manage individual RPM packages.',['rpm -q bash','rpm -ql openssh-server'],'-q queries; -ql lists files in an installed package.'],
['apt','apt COMMAND [PACKAGE]','Manage Debian packages and repositories.',['sudo apt update','sudo apt install nginx'],'update refreshes metadata; upgrade installs available updates.'],
['dpkg','dpkg [OPTIONS] PACKAGE','Manage individual Debian packages.',['sudo dpkg -i app.deb','dpkg -L bash'],'dpkg does not automatically resolve repository dependencies.'],
['systemctl','systemctl COMMAND UNIT','Manage systemd units.',['sudo systemctl enable --now sshd','systemctl status NetworkManager'],'start=now; enable=boot; --now combines both.'],
['journalctl','journalctl [OPTIONS]','Query the systemd journal.',['journalctl -u sshd','journalctl -b -p err'],'-u filters by unit; -b limits to a boot.'],
['ps','ps [OPTIONS]','Display process information.',['ps aux','ps -ef'],'aux is BSD-style; -ef is UNIX-style.'],
['top','top','Interactively display processes and resource use.',['top','top -H'],'Use load, CPU, memory, and process state together to identify bottlenecks.'],
['kill','kill [-SIGNAL] PID','Send a signal to a process ID.',['kill 1234','kill -TERM 1234'],'TERM requests graceful shutdown; KILL cannot be handled.'],
['pkill','pkill [OPTIONS] PATTERN','Signal processes selected by name or attributes.',['pkill firefox','pkill -u alice'],'Use carefully because it may match multiple processes.'],
['nice','nice -n VALUE COMMAND','Start a process with a selected nice value.',['nice -n 10 backup.sh','nice command'],'Higher nice value means lower CPU priority.'],
['renice','renice VALUE -p PID','Change the nice value of a running process.',['sudo renice 10 -p 1234','renice -5 -p 1234'],'Negative nice values normally require elevated privileges.'],
['ip','ip OBJECT COMMAND','Inspect or configure networking.',['ip addr show','ip route show'],'Use ip addr for addresses and ip route for routes.'],
['ss','ss [OPTIONS]','Display socket information.',['ss -tulpn','ss -s'],'Modern replacement for many netstat use cases.'],
['ping','ping [OPTIONS] HOST','Test IP reachability with ICMP.',['ping -c 4 8.8.8.8','ping -6 host'],'A failed ping does not always prove the host is down; ICMP may be filtered.'],
['dig','dig [OPTIONS] NAME','Query DNS.',['dig example.com','dig +short example.com'],'Use +short for concise output.'],
['nmcli','nmcli OBJECT COMMAND','Manage NetworkManager.',['nmcli device status','nmcli connection show'],'Distinguish devices from saved connections.'],
['curl','curl [OPTIONS] URL','Transfer data and test services using URLs.',['curl -I https://example.com','curl -O https://host/file'],'-I requests headers; -O keeps the remote filename.'],
['lsblk','lsblk [OPTIONS]','List block devices and relationships.',['lsblk','lsblk -f'],'-f adds filesystem type, label, and UUID.'],
['blkid','blkid [DEVICE]','Display filesystem metadata and UUIDs.',['sudo blkid','blkid /dev/sdb1'],'UUIDs are commonly used in /etc/fstab.'],
['df','df [OPTIONS] [PATH]','Report filesystem space usage.',['df -h','df -i'],'-i checks inode exhaustion, which can occur even when blocks remain.'],
['du','du [OPTIONS] PATH','Report file and directory usage.',['du -sh /var/log','du -h --max-depth=1 /home'],'df reports filesystem totals; du measures files and directories.'],
['mount','mount [OPTIONS] DEVICE DIR','Attach a filesystem.',['sudo mount /dev/sdb1 /mnt/data','mount | grep noexec'],'Mount options can block execution even when permissions allow it.'],
['fsck','fsck [OPTIONS] DEVICE','Check and repair supported filesystems.',['sudo fsck /dev/sdb1','sudo fsck -f /dev/sdb1'],'Usually run on an unmounted filesystem.'],
['pvcreate','pvcreate DEVICE','Initialize an LVM physical volume.',['sudo pvcreate /dev/sdb','sudo pvs'],'LVM order: PV → VG → LV → filesystem.'],
['vgcreate','vgcreate VG PV','Create an LVM volume group.',['sudo vgcreate data_vg /dev/sdb','sudo vgs'],'A volume group pools one or more physical volumes.'],
['lvcreate','lvcreate [OPTIONS] VG','Create an LVM logical volume.',['sudo lvcreate -L 10G -n data data_vg','sudo lvs'],'Create a filesystem after creating the LV.'],
['lvextend','lvextend [OPTIONS] LV','Extend an LVM logical volume.',['sudo lvextend -L +5G /dev/data_vg/data','sudo lvextend -r -l +100%FREE /dev/data_vg/data'],'-r grows the filesystem with the LV when supported.'],
['getenforce','getenforce','Show the current SELinux mode.',['getenforce'],'It reports Enforcing, Permissive, or Disabled.'],
['setenforce','setenforce 0|1','Temporarily change SELinux enforcing state.',['sudo setenforce 0','sudo setenforce 1'],'This is not persistent across reboot.'],
['restorecon','restorecon [OPTIONS] PATH','Restore default SELinux file contexts.',['sudo restorecon -Rv /var/www','restorecon file'],'Use after moving or creating content where policy expects a specific label.'],
['semanage','semanage OBJECT COMMAND','Manage persistent SELinux policy mappings.',['sudo semanage fcontext -a -t httpd_sys_content_t "/web(/.*)?"','sudo semanage port -l'],'Pair fcontext changes with restorecon.'],
['podman','podman COMMAND','Manage OCI containers and images.',['podman ps','podman run --rm alpine echo hello'],'Podman is daemonless and commonly used on Red Hat systems.'],
['crontab','crontab [OPTIONS]','Manage recurring per-user cron jobs.',['crontab -e','crontab -l'],'Cron fields are minute, hour, day-of-month, month, day-of-week.'],
['at','at TIME','Schedule a one-time job.',['echo "systemctl restart app" | at 23:00','atq'],'Use cron for recurring tasks and at for one-time tasks.'],
['ssh','ssh [USER@]HOST','Open an encrypted remote shell.',['ssh admin@server','ssh -i key.pem user@host'],'Check permissions on private keys and host-key prompts.'],
['scp','scp SOURCE DEST','Copy files over SSH.',['scp file user@host:/tmp/','scp user@host:/tmp/file .'],'Use rsync when efficient synchronization or resume behavior matters.'],
['modprobe','modprobe MODULE','Load or remove kernel modules with dependency handling.',['sudo modprobe bluetooth','sudo modprobe -r bluetooth'],'Prefer modprobe over insmod when dependencies matter.'],
['lsmod','lsmod','List loaded kernel modules.',['lsmod','lsmod | grep bluetooth'],'Use modinfo for module metadata.'],
['sysctl','sysctl [OPTIONS] KEY[=VALUE]','Read or change runtime kernel parameters.',['sysctl net.ipv4.ip_forward','sudo sysctl -w net.ipv4.ip_forward=1'],'Persistent settings belong in sysctl configuration files.']
].map(function(x){return {name:x[0],syntax:x[1],purpose:x[2],examples:x[3],tip:x[4]};});
var CRAM=[
['Permissions','chmod changes mode; chown changes owner; chgrp changes group; umask removes default bits.'],
['Links','Hard links share an inode and cannot cross filesystems. Symbolic links store a path and can cross filesystems.'],
['Search','find searches live files; locate searches a database; grep searches inside text.'],
['systemd','start affects now; enable affects boot; enable --now does both.'],
['Packages','dnf/apt resolve dependencies; rpm/dpkg work with individual package databases/files.'],
['Networking','ip addr = addresses; ip route = routes; ss = sockets; dig = DNS; ping = reachability.'],
['Storage','LVM order: pvcreate → vgcreate → lvcreate → mkfs → mount.'],
['SELinux','getenforce reads mode; setenforce changes runtime mode; semanage makes persistent mappings; restorecon applies policy labels.'],
['Processes','nice starts with priority; renice changes a running process; TERM is graceful; KILL is immediate.'],
['Archives','tar: c=create, x=extract, t=list, z=gzip, J=xz, f=file.'],
['Scheduling','cron is recurring; at is one-time.'],
['Containers','Know images vs containers, ports, volumes, logs, exec, and lifecycle commands.']
];
function read(){try{return JSON.parse(localStorage.getItem(STATS)||'{}')}catch(e){return {}}}
function write(v){try{localStorage.setItem(STATS,JSON.stringify(v))}catch(e){}}
function logQuestion(q,ok){if(!q)return;var s=read(),o=objectiveFor(q);s[o]=s[o]||{attempts:0,correct:0,last:null};s[o].attempts++;if(ok)s[o].correct++;s[o].last=new Date().toISOString();write(s)}
function pct(v){return v&&v.attempts?Math.round(100*v.correct/v.attempts):null}
function readiness(){var s=read(),rows=Object.keys(s).map(function(k){return {name:k,p:pct(s[k]),attempts:s[k].attempts}}),weighted=rows.reduce(function(a,x){return a+x.p*x.attempts},0),n=rows.reduce(function(a,x){return a+x.attempts},0),score=n?Math.round(weighted/n):0;return {score:score,rows:rows.sort(function(a,b){return a.p-b.p}),attempts:n}}
function esc2(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function panel(title,body){var old=document.getElementById('v65Modal');if(old)old.remove();var el=document.createElement('div');el.id='v65Modal';el.className='v65-modal';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label',title);el.innerHTML='<div class="v65-panel"><div class="v65-head"><h2>'+esc2(title)+'</h2><button class="btn" id="v65Close">Close</button></div>'+body+'</div>';document.body.appendChild(el);var close=document.getElementById('v65Close');close.onclick=function(){el.remove()};el.onclick=function(e){if(e.target===el)el.remove()};el.onkeydown=function(e){if(e.key==='Escape')el.remove()};close.focus()}
function showDashboard(){var r=readiness(),label=r.attempts<20?'Building baseline':r.score>=85?'High readiness':r.score>=75?'Nearly ready':r.score>=65?'Developing':'Needs focused review';var rows=r.rows.length?r.rows.map(function(x){return '<div class="mastery-row"><div><strong>'+esc2(x.name)+'</strong><small>'+x.attempts+' checked answers</small></div><div class="mastery-bar"><span style="width:'+x.p+'%"></span></div><b>'+x.p+'%</b></div>'}).join(''):'<p class="note">Check answers during practice to build objective-level readiness data.</p>';var weakest=r.rows.slice(0,3).map(function(x){return x.name}).join(', ')||'Not enough data yet';panel('Exam Readiness','<section class="readiness-hero"><strong>'+r.score+'%</strong><span>'+label+'</span><small>'+r.attempts+' objective-scored attempts</small></section><h3>Objective mastery</h3>'+rows+'<div class="coach-card"><strong>Recommended next step</strong><p>'+(r.attempts<20?'Complete a Quick 25 and check each answer for a useful baseline.':'Focus your next session on: '+esc2(weakest)+'.')+'</p></div>')}
function showCommands(){var body='<div class="command-search"><input id="cmdSearch" type="search" placeholder="Search '+COMMANDS.length+' commands"></div><div id="cmdList" class="command-list"></div>';panel('Command Center v1',body);var list=document.getElementById('cmdList'),input=document.getElementById('cmdSearch');function renderCmd(){var t=input.value.toLowerCase().trim(),a=COMMANDS.filter(function(c){return !t||(c.name+' '+c.purpose+' '+c.syntax+' '+c.tip).toLowerCase().includes(t)});list.innerHTML=a.map(function(c){return '<details class="command-card"><summary><code>'+esc2(c.name)+'</code><span>'+esc2(c.purpose)+'</span></summary><div><b>Syntax</b><pre>'+esc2(c.syntax)+'</pre><b>Examples</b>'+c.examples.map(function(e){return '<pre>'+esc2(e)+'</pre>'}).join('')+'<div class="exam-tip"><strong>Exam tip:</strong> '+esc2(c.tip)+'</div></div></details>'}).join('')||'<p>No commands found.</p>'}input.oninput=renderCmd;renderCmd()}
function showCram(){panel('Last-Hour Cram','<div class="cram-grid">'+CRAM.map(function(x){return '<article><h3>'+esc2(x[0])+'</h3><p>'+esc2(x[1])+'</p></article>'}).join('')+'</div><div class="coach-card"><strong>Final exam checklist</strong><p>Read every verb carefully, flag time-consuming questions, do not over-select “Choose two,” verify command direction and file paths, and save time for PBQs.</p></div>')}
function smartReview(){var r=readiness();if(!r.rows.length){setStartupStatus('Build a baseline first by checking answers in a Quick 10.','error');return}var weak=r.rows[0].name,sel=document.getElementById('objectiveSelect');if(sel)sel.value=weak;var cnt=document.getElementById('countSelect');if(cnt)cnt.value='25';var sh=document.getElementById('shuffleQuestions');if(sh)sh.checked=true;internalBegin()}
function addCoach(){if(!window.exam||!exam.length)return;var q=exam[idx],fb=document.getElementById('feedback');if(!fb||!fb.innerHTML||fb.querySelector('.v65-coach'))return;var cmd=COMMANDS.find(function(c){return (q.stem+' '+q.options.map(function(o){return o.text}).join(' ')).toLowerCase().includes(c.name.toLowerCase())});var clue=examTip(q);fb.insertAdjacentHTML('beforeend','<section class="v65-coach"><h3>🧠 Linux Coach</h3><p><strong>What the question is testing:</strong> '+esc2(objectiveFor(q))+'</p><p><strong>Clue to notice:</strong> '+esc2(clue)+'</p>'+(cmd?'<p><strong>Related command:</strong> <code>'+esc2(cmd.name)+'</code> — '+esc2(cmd.purpose)+'</p><p><strong>Memory tip:</strong> '+esc2(cmd.tip)+'</p>':'<p><strong>Memory tip:</strong> Match the scenario’s required action to the command’s primary purpose.</p>')+'</section>')}
window.LP65={commands:COMMANDS,readiness:readiness};
var baseRender=window.render;window.render=function(){baseRender();setTimeout(addCoach,0)};
document.addEventListener('DOMContentLoaded',function(){
 var host=document.querySelector('.quick-actions');if(host){host.insertAdjacentHTML('beforeend','<button type="button" class="btn" id="smartReviewBtn">🎯 Smart Review</button><button type="button" class="btn" id="dashboardBtn">📊 Readiness</button><button type="button" class="btn" id="commandsBtn">⌨️ Command Center</button><button type="button" class="btn" id="cramBtn">⚡ Last-Hour Cram</button>')}
 document.getElementById('dashboardBtn').onclick=showDashboard;document.getElementById('commandsBtn').onclick=showCommands;document.getElementById('cramBtn').onclick=showCram;document.getElementById('smartReviewBtn').onclick=smartReview;
 var check=document.getElementById('checkBtn');if(check){check.addEventListener('click',function(){setTimeout(function(){if(!exam||!exam[idx])return;var q=exam[idx],key=q.id+'|'+(answers[q.id]||[]).slice().sort().join(',');var seen={};try{seen=JSON.parse(sessionStorage.getItem(LOGGED)||'{}')}catch(e){}if(seen[key])return;seen[key]=1;try{sessionStorage.setItem(LOGGED,JSON.stringify(seen))}catch(e){}logQuestion(q,isCorrect(q))},0)})}
});
})();
