(function(){
  function clean(s){return String(s||'').replace(/\s+/g,' ').trim();}
  function firstSentence(s){var x=clean(s); var m=x.match(/^(.{1,220}?[.!?])(?:\s|$)/); return m?m[1]:x.slice(0,220)+(x.length>220?'…':'');}
  function conceptReason(q,o){
    var text=clean(o.text), all=(q.stem+' '+text).toLowerCase();
    var rv=(typeof reviewFor==='function')?reviewFor(q):null;
    if(rv&&rv.correctWhy) return rv.correctWhy;
    var p=(typeof purposeFor==='function')?purposeFor(text):'';
    if(p) return 'This is correct because it '+p+', matching the operation the scenario requires.';
    var rules=[
      [/password histor|circulating through/, 'Minimum password age prevents users from rapidly cycling through old passwords just to reuse a previous one.'],
      [/password exp|exposed password/, 'Password expiration limits how long a compromised credential remains useful and forces replacement after a defined period.'],
      [/environment variable|\.bashrc|profile/, 'Adding the export statement to the user’s shell startup file makes the variable available again in future login or interactive shell sessions.'],
      [/immutable|chattr/, 'The immutable attribute blocks modification, deletion, and renaming until the attribute is removed, even when normal permissions would otherwise allow changes.'],
      [/acl|access control list/, 'An ACL grants permissions to specific users or groups without changing the file’s basic owner, group, and other permission bits.'],
      [/sticky bit/, 'The sticky bit on a shared directory allows users to delete only files they own, protecting other users’ files.'],
      [/setuid|suid/, 'Setuid runs the executable with the file owner’s effective privileges, which is the behavior required in this scenario.'],
      [/setgid/, 'Setgid causes execution with the file group’s effective privileges or makes new files inherit the directory group.'],
      [/symbolic link|soft link/, 'A symbolic link stores a path to the target, so it can reference directories and cross filesystem boundaries.'],
      [/hard link/, 'A hard link points to the same inode and data as the original filename, so both names reference the same file content.'],
      [/\/etc\/fstab|persistent mount/, 'An entry in /etc/fstab defines a filesystem that should be mounted consistently, including during boot.'],
      [/swap/, 'Swap provides disk-backed virtual memory that the kernel can use when physical RAM is under pressure.'],
      [/raid 0|striping/, 'RAID 0 stripes data across disks for performance and capacity but provides no fault tolerance.'],
      [/raid 1|mirroring/, 'RAID 1 mirrors identical data across disks, allowing continued operation after one member fails.'],
      [/raid 5/, 'RAID 5 combines striping with distributed parity and can tolerate one disk failure.'],
      [/raid 6/, 'RAID 6 uses dual distributed parity and can tolerate two simultaneous disk failures.'],
      [/lvm|logical volume/, 'LVM separates storage into physical volumes, volume groups, and logical volumes so capacity can be allocated and resized flexibly.'],
      [/xfs/, 'XFS is a high-performance journaling filesystem that can be grown while mounted but cannot be shrunk.'],
      [/ext4/, 'ext4 is a journaling Linux filesystem with broad tool support and can be grown or shrunk when handled correctly.'],
      [/systemd|unit file/, 'systemd manages services and boot targets through unit files, dependencies, and service state.'],
      [/journal|logging/, 'The systemd journal centralizes service and kernel logs, making it the correct place to inspect recent events.'],
      [/cron|crontab/, 'Cron is designed for commands that must run repeatedly on a schedule.'],
      [/\bat\b|one-time/, 'The at service schedules a command to run once at a specified future time.'],
      [/nohup/, 'nohup ignores the hangup signal so the process can continue after the user logs out.'],
      [/foreground|\bfg\b/, 'The fg shell builtin brings a stopped or background job into the current terminal’s foreground.'],
      [/webhook|http-based callback/, 'A webhook is an HTTP callback sent automatically when an event occurs, rather than requiring continuous polling.'],
      [/virtual environment|package conflicts/, 'A Python virtual environment isolates project packages and versions so one project’s dependencies do not conflict with another’s.'],
      [/ssh key|passwordless|ssh-copy-id/, 'The key pair provides public-key authentication, and ssh-copy-id installs the public key in the remote account’s authorized_keys file.'],
      [/selinux|security context/, 'SELinux makes access decisions using policy and security contexts in addition to traditional Unix permissions.'],
      [/firewall|firewalld|port/, 'The firewall rule permits the required network traffic while leaving unrelated ports protected.'],
      [/dns|name resolution/, 'DNS translates hostnames and domain names into IP addresses, which is the specific service involved here.'],
      [/default gateway|route/, 'The default route identifies where traffic is sent when no more-specific route matches the destination.'],
      [/subnet|cidr|netmask/, 'The subnet prefix determines which address bits identify the network and which identify hosts.'],
      [/container|podman|docker/, 'Containers isolate applications and dependencies while sharing the host kernel, making them lighter than full virtual machines.'],
      [/ansible|playbook/, 'Ansible applies declarative tasks from a playbook to managed hosts over inventory-defined connections.'],
      [/git|version control/, 'Git records file history and changes, allowing revisions to be compared, shared, and restored.'],
      [/shebang|#!\//, 'The shebang names the interpreter the operating system should use when executing the script directly.'],
      [/standard output|stdout|redirect/, 'Shell redirection sends the command’s output stream to the specified destination instead of the terminal.'],
      [/pipe|pipeline/, 'A pipe connects one command’s standard output to the next command’s standard input.'],
      [/regular expression|regex/, 'The regular expression matches the requested text pattern rather than requiring an exact literal string.'],
      [/kernel module/, 'Kernel modules extend kernel functionality and can be loaded or removed without rebuilding the entire kernel.'],
      [/initramfs/, 'The initramfs supplies early-boot drivers and tools needed before the real root filesystem is mounted.'],
      [/grub|bootloader/, 'GRUB loads the selected kernel and passes boot parameters during the system startup process.'],
      [/pxe|network boot/, 'PXE lets a system obtain boot information and installation resources over the network.'],
      [/open source|copyleft|license/, 'The selected license terms match the stated rights and obligations for using, modifying, and redistributing the software.']
    ];
    for(var i=0;i<rules.length;i++) if(rules[i][0].test(all)) return rules[i][1];
    var need=(typeof shortNeed==='function')?shortNeed(q.stem):firstSentence(q.stem);
    return 'This choice is correct because “'+text+'” provides the Linux behavior needed to '+clean(need).replace(/[?.]+$/,'')+'.';
  }
  var baseRationale=window.rationale;
  window.rationale=function(q,o){
    if(q.correct.indexOf(o.label)!==-1) return conceptReason(q,o);
    return baseRationale?baseRationale(q,o):'This option performs a different operation than the one required by the scenario.';
  };
  window.LP67={version:'6.7',explainCorrect:conceptReason};
})();
