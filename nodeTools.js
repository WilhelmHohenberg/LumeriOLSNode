// ============================================================
//  SIGMA NODE BRIDGE — TurboWarp Unsandboxed Extension
//  Requires: node-companion-server.js on localhost:43210
//  Load via: TurboWarp → Load Unsandboxed Extension
// ============================================================

(function (Scratch) {
  "use strict";

  const SERVER = "http://localhost:43210";

  // ── Core helpers ──────────────────────────────────────────────────────────

  async function ping() {
    try {
      const r = await fetch(SERVER + "/status");
      const j = await r.json();
      return !!j.success;
    } catch { return false; }
  }

  async function call(endpoint, body = {}) {
    try {
      const res = await fetch(SERVER + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async function callGET(endpoint) {
    try {
      const res = await fetch(SERVER + endpoint);
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function val(r, key) {
    if (!r || !r.success) return r?.error ?? "error";
    if (key === undefined) return JSON.stringify(r);
    return r[key] !== undefined ? String(r[key]) : "null";
  }

  function bool(r, key) {
    if (!r || !r.success) return false;
    return !!r[key];
  }

  // ── Extension ─────────────────────────────────────────────────────────────

  class SigmaBridge {
    getInfo() {
      return {
        id: "sigmaBridge",
        name: "⚡ Sigma Node Bridge",
        color1: "#0d1117",
        color2: "#161b22",
        color3: "#21262d",
        blocks: [

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "🔌 Server & Status" },
          // ══════════════════════════════════════════════════

          {
            opcode: "isAlive",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "node server working?",
          },
          {
            opcode: "serverConnected",
            blockType: Scratch.BlockType.REPORTER,
            text: "server status",
          },
          {
            opcode: "nodeVersion",
            blockType: Scratch.BlockType.REPORTER,
            text: "node version",
          },
          {
            opcode: "serverPlatform",
            blockType: Scratch.BlockType.REPORTER,
            text: "server OS platform",
          },
          {
            opcode: "serverUptime",
            blockType: Scratch.BlockType.REPORTER,
            text: "server uptime (seconds)",
          },
          {
            opcode: "serverCwd",
            blockType: Scratch.BlockType.REPORTER,
            text: "server current directory",
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "📁 File System — Read & Write" },
          // ══════════════════════════════════════════════════

          {
            opcode: "readFile",
            blockType: Scratch.BlockType.REPORTER,
            text: "read file [FILE]",
            arguments: { FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "test.txt" } },
          },
          {
            opcode: "writeFile",
            blockType: Scratch.BlockType.COMMAND,
            text: "write [TEXT] to file [FILE]",
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "hello world" },
              FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "test.txt" },
            },
          },
          {
            opcode: "appendFile",
            blockType: Scratch.BlockType.COMMAND,
            text: "append [TEXT] to file [FILE]",
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "more stuff" },
              FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "test.txt" },
            },
          },
          {
            opcode: "readFileBytes",
            blockType: Scratch.BlockType.REPORTER,
            text: "read file [FILE] as base64",
            arguments: { FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "image.png" } },
          },
          {
            opcode: "writeFileBase64",
            blockType: Scratch.BlockType.COMMAND,
            text: "write base64 [DATA] to file [FILE]",
            arguments: {
              DATA: { type: Scratch.ArgumentType.STRING, defaultValue: "SGVsbG8=" },
              FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "out.bin" },
            },
          },
          {
            opcode: "readJSON",
            blockType: Scratch.BlockType.REPORTER,
            text: "read JSON file [FILE] key [KEY]",
            arguments: {
              FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "data.json" },
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "name" },
            },
          },
          {
            opcode: "writeJSON",
            blockType: Scratch.BlockType.COMMAND,
            text: "write JSON [JSON] to file [FILE]",
            arguments: {
              JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '{"name":"scratch"}' },
              FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "data.json" },
            },
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "📁 File System — Manage" },
          // ══════════════════════════════════════════════════

          {
            opcode: "deleteFile",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete file [FILE]",
            arguments: { FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "test.txt" } },
          },
          {
            opcode: "copyFile",
            blockType: Scratch.BlockType.COMMAND,
            text: "copy file [FROM] → [TO]",
            arguments: {
              FROM: { type: Scratch.ArgumentType.STRING, defaultValue: "a.txt" },
              TO: { type: Scratch.ArgumentType.STRING, defaultValue: "b.txt" },
            },
          },
          {
            opcode: "moveFile",
            blockType: Scratch.BlockType.COMMAND,
            text: "move/rename file [FROM] → [TO]",
            arguments: {
              FROM: { type: Scratch.ArgumentType.STRING, defaultValue: "a.txt" },
              TO: { type: Scratch.ArgumentType.STRING, defaultValue: "b.txt" },
            },
          },
          {
            opcode: "fileExists",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "file/folder [PATH] exists?",
            arguments: { PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "test.txt" } },
          },
          {
            opcode: "isFileCheck",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[PATH] is a file?",
            arguments: { PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "test.txt" } },
          },
          {
            opcode: "isDirCheck",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "[PATH] is a folder?",
            arguments: { PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "/tmp" } },
          },
          {
            opcode: "fileSize",
            blockType: Scratch.BlockType.REPORTER,
            text: "size of [FILE] in bytes",
            arguments: { FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "test.txt" } },
          },
          {
            opcode: "fileMtime",
            blockType: Scratch.BlockType.REPORTER,
            text: "last modified time of [FILE]",
            arguments: { FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "test.txt" } },
          },
          {
            opcode: "fileLineCount",
            blockType: Scratch.BlockType.REPORTER,
            text: "line count of [FILE]",
            arguments: { FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "test.txt" } },
          },
          {
            opcode: "readFileLine",
            blockType: Scratch.BlockType.REPORTER,
            text: "read line [LINE] of file [FILE]",
            arguments: {
              LINE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "test.txt" },
            },
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "📂 Directories" },
          // ══════════════════════════════════════════════════

          {
            opcode: "mkdir",
            blockType: Scratch.BlockType.COMMAND,
            text: "create folder [PATH]",
            arguments: { PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "myfolder" } },
          },
          {
            opcode: "listDir",
            blockType: Scratch.BlockType.REPORTER,
            text: "list folder [PATH]",
            arguments: { PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "." } },
          },
          {
            opcode: "listDirItem",
            blockType: Scratch.BlockType.REPORTER,
            text: "item [N] in folder [PATH]",
            arguments: {
              N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "." },
            },
          },
          {
            opcode: "listDirCount",
            blockType: Scratch.BlockType.REPORTER,
            text: "count items in folder [PATH]",
            arguments: { PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "." } },
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "⚙️ Shell / Terminal" },
          // ══════════════════════════════════════════════════

          {
            opcode: "runCmd",
            blockType: Scratch.BlockType.REPORTER,
            text: "run [CMD]",
            arguments: { CMD: { type: Scratch.ArgumentType.STRING, defaultValue: "echo sigma" } },
          },
          {
            opcode: "runCmdStderr",
            blockType: Scratch.BlockType.REPORTER,
            text: "run [CMD] stderr",
            arguments: { CMD: { type: Scratch.ArgumentType.STRING, defaultValue: "ls /nope" } },
          },
          {
            opcode: "runCmdOk",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "run [CMD] succeeded?",
            arguments: { CMD: { type: Scratch.ArgumentType.STRING, defaultValue: "echo hi" } },
          },
          {
            opcode: "runCmdInDir",
            blockType: Scratch.BlockType.REPORTER,
            text: "run [CMD] in [DIR]",
            arguments: {
              CMD: { type: Scratch.ArgumentType.STRING, defaultValue: "ls" },
              DIR: { type: Scratch.ArgumentType.STRING, defaultValue: "/tmp" },
            },
          },
          {
            opcode: "runCmdTimeout",
            blockType: Scratch.BlockType.REPORTER,
            text: "run [CMD] timeout [MS] ms",
            arguments: {
              CMD: { type: Scratch.ArgumentType.STRING, defaultValue: "sleep 1 && echo done" },
              MS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5000 },
            },
          },
          {
            opcode: "openApp",
            blockType: Scratch.BlockType.COMMAND,
            text: "open app/file [PATH]",
            arguments: { PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "notepad.exe" } },
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "🌐 HTTP / Network" },
          // ══════════════════════════════════════════════════

          {
            opcode: "httpGet",
            blockType: Scratch.BlockType.REPORTER,
            text: "GET [URL]",
            arguments: { URL: { type: Scratch.ArgumentType.STRING, defaultValue: "https://api.ipify.org" } },
          },
          {
            opcode: "httpGetStatus",
            blockType: Scratch.BlockType.REPORTER,
            text: "GET [URL] status code",
            arguments: { URL: { type: Scratch.ArgumentType.STRING, defaultValue: "https://example.com" } },
          },
          {
            opcode: "httpGetHeader",
            blockType: Scratch.BlockType.REPORTER,
            text: "GET [URL] header [H]",
            arguments: {
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: "https://example.com" },
              H: { type: Scratch.ArgumentType.STRING, defaultValue: "content-type" },
            },
          },
          {
            opcode: "httpPost",
            blockType: Scratch.BlockType.REPORTER,
            text: "POST [URL] JSON [BODY]",
            arguments: {
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: "https://httpbin.org/post" },
              BODY: { type: Scratch.ArgumentType.STRING, defaultValue: '{"key":"sigma"}' },
            },
          },
          {
            opcode: "httpPostForm",
            blockType: Scratch.BlockType.REPORTER,
            text: "POST [URL] form [DATA]",
            arguments: {
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: "https://httpbin.org/post" },
              DATA: { type: Scratch.ArgumentType.STRING, defaultValue: "key=sigma&rizz=max" },
            },
          },
          {
            opcode: "httpRequest",
            blockType: Scratch.BlockType.REPORTER,
            text: "HTTP [METHOD] [URL] headers [H] body [B]",
            arguments: {
              METHOD: { type: Scratch.ArgumentType.STRING, defaultValue: "PATCH" },
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: "https://httpbin.org/patch" },
              H: { type: Scratch.ArgumentType.STRING, defaultValue: '{"Authorization":"Bearer token"}' },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: '{"update":true}' },
            },
          },
          {
            opcode: "downloadFile",
            blockType: Scratch.BlockType.COMMAND,
            text: "download [URL] save to [FILE]",
            arguments: {
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: "https://example.com/file.txt" },
              FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "downloaded.txt" },
            },
          },
          {
            opcode: "myPublicIP",
            blockType: Scratch.BlockType.REPORTER,
            text: "my public IP address",
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "🔧 Environment Variables" },
          // ══════════════════════════════════════════════════

          {
            opcode: "envGet",
            blockType: Scratch.BlockType.REPORTER,
            text: "env [KEY]",
            arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "HOME" } },
          },
          {
            opcode: "envSet",
            blockType: Scratch.BlockType.COMMAND,
            text: "set env [KEY] = [VALUE]",
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "MY_VAR" },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "sigma" },
            },
          },
          {
            opcode: "envHas",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "env [KEY] exists?",
            arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "HOME" } },
          },
          {
            opcode: "envAll",
            blockType: Scratch.BlockType.REPORTER,
            text: "all env vars (JSON)",
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "💻 OS & System Info" },
          // ══════════════════════════════════════════════════

          {
            opcode: "osHostname",
            blockType: Scratch.BlockType.REPORTER,
            text: "hostname",
          },
          {
            opcode: "osArch",
            blockType: Scratch.BlockType.REPORTER,
            text: "CPU architecture",
          },
          {
            opcode: "osCpus",
            blockType: Scratch.BlockType.REPORTER,
            text: "number of CPUs",
          },
          {
            opcode: "osTotalMem",
            blockType: Scratch.BlockType.REPORTER,
            text: "total RAM (bytes)",
          },
          {
            opcode: "osFreeMem",
            blockType: Scratch.BlockType.REPORTER,
            text: "free RAM (bytes)",
          },
          {
            opcode: "osMemPercent",
            blockType: Scratch.BlockType.REPORTER,
            text: "RAM used %",
          },
          {
            opcode: "osHomedir",
            blockType: Scratch.BlockType.REPORTER,
            text: "home directory",
          },
          {
            opcode: "osTmpdir",
            blockType: Scratch.BlockType.REPORTER,
            text: "temp directory",
          },
          {
            opcode: "osUptime",
            blockType: Scratch.BlockType.REPORTER,
            text: "OS uptime (seconds)",
          },
          {
            opcode: "osUsername",
            blockType: Scratch.BlockType.REPORTER,
            text: "current username",
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "📐 Path Utils" },
          // ══════════════════════════════════════════════════

          {
            opcode: "pathJoin",
            blockType: Scratch.BlockType.REPORTER,
            text: "join [A] + [B]",
            arguments: {
              A: { type: Scratch.ArgumentType.STRING, defaultValue: "/home/user" },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: "file.txt" },
            },
          },
          {
            opcode: "pathBasename",
            blockType: Scratch.BlockType.REPORTER,
            text: "basename of [P]",
            arguments: { P: { type: Scratch.ArgumentType.STRING, defaultValue: "/home/user/file.txt" } },
          },
          {
            opcode: "pathDirname",
            blockType: Scratch.BlockType.REPORTER,
            text: "dirname of [P]",
            arguments: { P: { type: Scratch.ArgumentType.STRING, defaultValue: "/home/user/file.txt" } },
          },
          {
            opcode: "pathExtname",
            blockType: Scratch.BlockType.REPORTER,
            text: "extension of [P]",
            arguments: { P: { type: Scratch.ArgumentType.STRING, defaultValue: "/home/user/file.txt" } },
          },
          {
            opcode: "pathResolve",
            blockType: Scratch.BlockType.REPORTER,
            text: "resolve path [P]",
            arguments: { P: { type: Scratch.ArgumentType.STRING, defaultValue: "../stuff" } },
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "⚡ Eval & Raw Node.js" },
          // ══════════════════════════════════════════════════

          {
            opcode: "evalJS",
            blockType: Scratch.BlockType.REPORTER,
            text: "eval [CODE]",
            arguments: { CODE: { type: Scratch.ArgumentType.STRING, defaultValue: "1 + 1" } },
          },
          {
            opcode: "evalAsync",
            blockType: Scratch.BlockType.REPORTER,
            text: "eval async [CODE]",
            arguments: { CODE: { type: Scratch.ArgumentType.STRING, defaultValue: "await Promise.resolve(42)" } },
          },
          {
            opcode: "requireModule",
            blockType: Scratch.BlockType.REPORTER,
            text: "require('[MOD]') . [PROP]",
            arguments: {
              MOD: { type: Scratch.ArgumentType.STRING, defaultValue: "os" },
              PROP: { type: Scratch.ArgumentType.STRING, defaultValue: "platform()" },
            },
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "🔄 Process Control" },
          // ══════════════════════════════════════════════════

          {
            opcode: "processCwd",
            blockType: Scratch.BlockType.REPORTER,
            text: "process cwd",
          },
          {
            opcode: "processChdir",
            blockType: Scratch.BlockType.COMMAND,
            text: "cd to [DIR]",
            arguments: { DIR: { type: Scratch.ArgumentType.STRING, defaultValue: "/tmp" } },
          },
          {
            opcode: "processPid",
            blockType: Scratch.BlockType.REPORTER,
            text: "server PID",
          },
          {
            opcode: "processMemory",
            blockType: Scratch.BlockType.REPORTER,
            text: "server memory [TYPE]",
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "memTypes",
                defaultValue: "heapUsed",
              },
            },
          },
          {
            opcode: "processExit",
            blockType: Scratch.BlockType.COMMAND,
            text: "exit server with code [CODE]",
            arguments: { CODE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } },
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "🕒 Date & Time (Server)" },
          // ══════════════════════════════════════════════════

          {
            opcode: "serverTimestamp",
            blockType: Scratch.BlockType.REPORTER,
            text: "server unix timestamp (ms)",
          },
          {
            opcode: "serverDate",
            blockType: Scratch.BlockType.REPORTER,
            text: "server date (ISO)",
          },
          {
            opcode: "serverTimeZone",
            blockType: Scratch.BlockType.REPORTER,
            text: "server timezone",
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "🔑 Crypto & Hashing" },
          // ══════════════════════════════════════════════════

          {
            opcode: "hashMD5",
            blockType: Scratch.BlockType.REPORTER,
            text: "MD5 hash of [TEXT]",
            arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "sigma" } },
          },
          {
            opcode: "hashSHA256",
            blockType: Scratch.BlockType.REPORTER,
            text: "SHA256 hash of [TEXT]",
            arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "sigma" } },
          },
          {
            opcode: "hashSHA1",
            blockType: Scratch.BlockType.REPORTER,
            text: "SHA1 hash of [TEXT]",
            arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "sigma" } },
          },
          {
            opcode: "randomBytes",
            blockType: Scratch.BlockType.REPORTER,
            text: "random [N] bytes (hex)",
            arguments: { N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 16 } },
          },
          {
            opcode: "randomUUID",
            blockType: Scratch.BlockType.REPORTER,
            text: "random UUID",
          },
          {
            opcode: "base64Encode",
            blockType: Scratch.BlockType.REPORTER,
            text: "base64 encode [TEXT]",
            arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "hello sigma" } },
          },
          {
            opcode: "base64Decode",
            blockType: Scratch.BlockType.REPORTER,
            text: "base64 decode [TEXT]",
            arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "aGVsbG8gc2lnbWE=" } },
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "📋 Clipboard (Desktop)" },
          // ══════════════════════════════════════════════════

          {
            opcode: "clipboardRead",
            blockType: Scratch.BlockType.REPORTER,
            text: "read clipboard",
          },
          {
            opcode: "clipboardWrite",
            blockType: Scratch.BlockType.COMMAND,
            text: "write [TEXT] to clipboard",
            arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "sigma rizz" } },
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "🔔 Notifications & UI" },
          // ══════════════════════════════════════════════════

          {
            opcode: "sendNotification",
            blockType: Scratch.BlockType.COMMAND,
            text: "send notification title [TITLE] body [MSG]",
            arguments: {
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: "Scratch says" },
              MSG: { type: Scratch.ArgumentType.STRING, defaultValue: "sigma grindset 💪" },
            },
          },
          {
            opcode: "openURL",
            blockType: Scratch.BlockType.COMMAND,
            text: "open URL [URL] in browser",
            arguments: { URL: { type: Scratch.ArgumentType.STRING, defaultValue: "https://turbowarp.org" } },
          },
          {
            opcode: "playBeep",
            blockType: Scratch.BlockType.COMMAND,
            text: "play system beep",
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "💾 Key-Value Store (Persistent)" },
          // ══════════════════════════════════════════════════

          {
            opcode: "storeSet",
            blockType: Scratch.BlockType.COMMAND,
            text: "store [KEY] = [VALUE]",
            arguments: {
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "score" },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "9999" },
            },
          },
          {
            opcode: "storeGet",
            blockType: Scratch.BlockType.REPORTER,
            text: "get store [KEY]",
            arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "score" } },
          },
          {
            opcode: "storeDelete",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete store [KEY]",
            arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "score" } },
          },
          {
            opcode: "storeHas",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "store has [KEY]?",
            arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "score" } },
          },
          {
            opcode: "storeKeys",
            blockType: Scratch.BlockType.REPORTER,
            text: "all store keys (JSON)",
          },
          {
            opcode: "storeClear",
            blockType: Scratch.BlockType.COMMAND,
            text: "clear all store",
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "🌍 DNS & Networking" },
          // ══════════════════════════════════════════════════

          {
            opcode: "dnsLookup",
            blockType: Scratch.BlockType.REPORTER,
            text: "DNS lookup [HOST]",
            arguments: { HOST: { type: Scratch.ArgumentType.STRING, defaultValue: "google.com" } },
          },
          {
            opcode: "pingHost",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "can reach [HOST]?",
            arguments: { HOST: { type: Scratch.ArgumentType.STRING, defaultValue: "google.com" } },
          },

          // ══════════════════════════════════════════════════
          { blockType: Scratch.BlockType.LABEL, text: "🎲 Skibidi Sigma Extras" },
          // ══════════════════════════════════════════════════

          {
            opcode: "sigmaRizz",
            blockType: Scratch.BlockType.REPORTER,
            text: "sigma rizz level",
          },
          {
            opcode: "Ohio",
            blockType: Scratch.BlockType.REPORTER,
            text: "is this ohio?",
          },
          {
            opcode: "executeMatrix",
            blockType: Scratch.BlockType.REPORTER,
            text: "red pill or blue pill?",
          },
          {
            opcode: "brainrot",
            blockType: Scratch.BlockType.REPORTER,
            text: "brainrot quote",
          },
          {
            opcode: "gigachad",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is server gigachad?",
          },
        ],

        menus: {
          memTypes: {
            acceptReporters: false,
            items: ["heapUsed", "heapTotal", "rss", "external"],
          },
        },
      };
    }

    // ── SERVER STATUS ────────────────────────────────────────────────────────

    async isAlive() { return await ping(); }
    async serverConnected() { return (await ping()) ? "online ✅" : "offline ❌"; }
    async nodeVersion() { return val(await callGET("/status"), "version"); }
    async serverPlatform() { return val(await callGET("/status"), "platform"); }
    async serverUptime() { return val(await callGET("/status"), "uptime"); }
    async serverCwd() { return val(await callGET("/status"), "cwd"); }

    // ── FILE SYSTEM ──────────────────────────────────────────────────────────

    async readFile(args) {
      const r = await call("/fs/read", { path: args.FILE });
      return r.success ? r.data : r.error;
    }
    async writeFile(args) {
      await call("/fs/write", { path: args.FILE, data: args.TEXT });
    }
    async appendFile(args) {
      await call("/fs/append", { path: args.FILE, data: args.TEXT });
    }
    async readFileBytes(args) {
      const r = await call("/fs/read", { path: args.FILE, encoding: "base64" });
      return r.success ? r.data : r.error;
    }
    async writeFileBase64(args) {
      await call("/fs/write", { path: args.FILE, data: args.DATA, encoding: "base64" });
    }
    async readJSON(args) {
      const r = await call("/fs/read", { path: args.FILE });
      if (!r.success) return r.error;
      try {
        const obj = JSON.parse(r.data);
        const val = obj[args.KEY];
        return val !== undefined ? String(val) : "null";
      } catch { return "parse error"; }
    }
    async writeJSON(args) {
      let parsed;
      try { parsed = JSON.parse(args.JSON); } catch { parsed = args.JSON; }
      await call("/fs/write", { path: args.FILE, data: JSON.stringify(parsed, null, 2) });
    }
    async deleteFile(args) { await call("/fs/delete", { path: args.FILE }); }
    async copyFile(args) { await call("/fs/copy", { from: args.FROM, to: args.TO }); }
    async moveFile(args) { await call("/fs/rename", { from: args.FROM, to: args.TO }); }
    async fileExists(args) {
      const r = await call("/fs/exists", { path: args.PATH });
      return !!(r && r.success && r.exists);
    }
    async isFileCheck(args) {
      const r = await call("/fs/stat", { path: args.PATH });
      return !!(r && r.success && r.isFile);
    }
    async isDirCheck(args) {
      const r = await call("/fs/stat", { path: args.PATH });
      return !!(r && r.success && r.isDirectory);
    }
    async fileSize(args) {
      const r = await call("/fs/stat", { path: args.FILE });
      return r.success ? String(r.size) : r.error;
    }
    async fileMtime(args) {
      const r = await call("/fs/stat", { path: args.FILE });
      return r.success ? String(r.mtime) : r.error;
    }
    async fileLineCount(args) {
      const r = await call("/fs/read", { path: args.FILE });
      if (!r.success) return r.error;
      return String(r.data.split("\n").length);
    }
    async readFileLine(args) {
      const r = await call("/fs/read", { path: args.FILE });
      if (!r.success) return r.error;
      const lines = r.data.split("\n");
      const idx = Number(args.LINE) - 1;
      return idx >= 0 && idx < lines.length ? lines[idx] : "";
    }

    // ── DIRECTORIES ──────────────────────────────────────────────────────────

    async mkdir(args) { await call("/fs/mkdir", { path: args.PATH }); }
    async listDir(args) {
      const r = await call("/fs/readdir", { path: args.PATH });
      return r.success ? JSON.stringify(r.entries) : r.error;
    }
    async listDirItem(args) {
      const r = await call("/fs/readdir", { path: args.PATH });
      if (!r.success) return r.error;
      return r.entries[Number(args.N) - 1] ?? "";
    }
    async listDirCount(args) {
      const r = await call("/fs/readdir", { path: args.PATH });
      return r.success ? String(r.entries.length) : "0";
    }

    // ── SHELL ────────────────────────────────────────────────────────────────

    async runCmd(args) {
      const r = await call("/exec", { command: args.CMD });
      return r?.stdout?.trim() ?? r?.error ?? "error";
    }
    async runCmdStderr(args) {
      const r = await call("/exec", { command: args.CMD });
      return r?.stderr?.trim() ?? "";
    }
    async runCmdOk(args) {
      const r = await call("/exec", { command: args.CMD });
      return !!(r && r.success);
    }
    async runCmdInDir(args) {
      const r = await call("/exec", { command: args.CMD, cwd: args.DIR });
      return r?.stdout?.trim() ?? r?.error ?? "error";
    }
    async runCmdTimeout(args) {
      const r = await call("/exec", { command: args.CMD, timeout: Number(args.MS) });
      return r?.stdout?.trim() ?? r?.error ?? "error";
    }
    async openApp(args) {
      const platform = (await callGET("/status"))?.platform ?? "linux";
      let cmd;
      if (platform === "win32") cmd = `start "" "${args.PATH}"`;
      else if (platform === "darwin") cmd = `open "${args.PATH}"`;
      else cmd = `xdg-open "${args.PATH}"`;
      await call("/exec", { command: cmd });
    }

    // ── HTTP ─────────────────────────────────────────────────────────────────

    async httpGet(args) {
      return val(await call("/fetch", { url: args.URL, method: "GET" }), "body");
    }
    async httpGetStatus(args) {
      const r = await call("/fetch", { url: args.URL, method: "GET" });
      return r?.success ? String(r.status) : r?.error ?? "error";
    }
    async httpGetHeader(args) {
      const r = await call("/fetch", { url: args.URL, method: "GET" });
      if (!r?.success) return r?.error ?? "error";
      return String(r.headers?.[args.H.toLowerCase()] ?? "");
    }
    async httpPost(args) {
      return val(await call("/fetch", {
        url: args.URL, method: "POST", body: args.BODY,
        headers: { "Content-Type": "application/json" },
      }), "body");
    }
    async httpPostForm(args) {
      return val(await call("/fetch", {
        url: args.URL, method: "POST", body: args.DATA,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }), "body");
    }
    async httpRequest(args) {
      let headers = {};
      try { headers = JSON.parse(args.H); } catch (_) {}
      return val(await call("/fetch", {
        url: args.URL, method: args.METHOD, body: args.B, headers,
      }), "body");
    }
    async downloadFile(args) {
      await call("/eval", {
        code: `
          const https = require('https');
          const http = require('http');
          const fs = require('fs');
          await new Promise((res, rej) => {
            const u = new URL(${JSON.stringify(args.URL)});
            const lib = u.protocol === 'https:' ? https : http;
            const file = fs.createWriteStream(${JSON.stringify(args.FILE)});
            lib.get(${JSON.stringify(args.URL)}, r => { r.pipe(file); file.on('finish', () => { file.close(); res(); }); }).on('error', rej);
          });
          'done'
        `,
      });
    }
    async myPublicIP() {
      return val(await call("/fetch", { url: "https://api.ipify.org", method: "GET" }), "body");
    }

    // ── ENV ──────────────────────────────────────────────────────────────────

    async envGet(args) { return val(await call("/env/get", { key: args.KEY }), "value"); }
    async envSet(args) { await call("/env/set", { key: args.KEY, value: args.VALUE }); }
    async envHas(args) {
      const r = await call("/env/get", { key: args.KEY });
      return !!(r && r.success && r.value !== null && r.value !== undefined);
    }
    async envAll() {
      const r = await call("/env/all");
      return r.success ? JSON.stringify(r.env) : r.error;
    }

    // ── OS ───────────────────────────────────────────────────────────────────

    async osHostname() { return val(await call("/os"), "hostname"); }
    async osArch() { return val(await call("/os"), "arch"); }
    async osCpus() { return val(await call("/os"), "cpus"); }
    async osTotalMem() { return val(await call("/os"), "totalmem"); }
    async osFreeMem() { return val(await call("/os"), "freemem"); }
    async osMemPercent() {
      const r = await call("/os");
      if (!r?.success) return "error";
      return String(Math.round((1 - r.freemem / r.totalmem) * 100)) + "%";
    }
    async osHomedir() { return val(await call("/os"), "homedir"); }
    async osTmpdir() { return val(await call("/os"), "tmpdir"); }
    async osUptime() { return val(await call("/os"), "uptime"); }
    async osUsername() {
      const r = await call("/os");
      return r?.success ? String(r.userInfo?.username ?? "") : r?.error ?? "error";
    }

    // ── PATH ─────────────────────────────────────────────────────────────────

    async pathJoin(args) { return val(await call("/path/join", { parts: [args.A, args.B] }), "result"); }
    async pathBasename(args) { return val(await call("/path/basename", { p: args.P }), "result"); }
    async pathDirname(args) { return val(await call("/path/dirname", { p: args.P }), "result"); }
    async pathExtname(args) { return val(await call("/path/extname", { p: args.P }), "result"); }
    async pathResolve(args) { return val(await call("/path/resolve", { parts: [args.P] }), "result"); }

    // ── EVAL ─────────────────────────────────────────────────────────────────

    async evalJS(args) { return val(await call("/eval", { code: args.CODE }), "result"); }
    async evalAsync(args) {
      return val(await call("/eval", {
        code: `(async () => { return (${args.CODE}); })()`,
      }), "result");
    }
    async requireModule(args) {
      return val(await call("/eval", {
        code: `String(require('${args.MOD}').${args.PROP})`,
      }), "result");
    }

    // ── PROCESS ──────────────────────────────────────────────────────────────

    async processCwd() { return val(await call("/process/cwd"), "cwd"); }
    async processChdir(args) { await call("/process/chdir", { dir: args.DIR }); }
    async processPid() { return val(await call("/process/pid"), "pid"); }
    async processMemory(args) {
      const r = await call("/eval", { code: `JSON.stringify(process.memoryUsage())` });
      if (!r?.success) return r?.error ?? "error";
      try {
        const mem = JSON.parse(r.result);
        return String(mem[args.TYPE] ?? "null");
      } catch { return "error"; }
    }
    async processExit(args) { await call("/process/exit", { code: Number(args.CODE) }); }

    // ── DATE & TIME ──────────────────────────────────────────────────────────

    async serverTimestamp() {
      return val(await call("/eval", { code: "Date.now()" }), "result");
    }
    async serverDate() {
      return val(await call("/eval", { code: "new Date().toISOString()" }), "result");
    }
    async serverTimeZone() {
      return val(await call("/eval", {
        code: "Intl.DateTimeFormat().resolvedOptions().timeZone"
      }), "result");
    }

    // ── CRYPTO ───────────────────────────────────────────────────────────────

    async hashMD5(args) {
      return val(await call("/eval", {
        code: `require('crypto').createHash('md5').update(${JSON.stringify(args.TEXT)}).digest('hex')`,
      }), "result");
    }
    async hashSHA256(args) {
      return val(await call("/eval", {
        code: `require('crypto').createHash('sha256').update(${JSON.stringify(args.TEXT)}).digest('hex')`,
      }), "result");
    }
    async hashSHA1(args) {
      return val(await call("/eval", {
        code: `require('crypto').createHash('sha1').update(${JSON.stringify(args.TEXT)}).digest('hex')`,
      }), "result");
    }
    async randomBytes(args) {
      return val(await call("/eval", {
        code: `require('crypto').randomBytes(${Number(args.N)}).toString('hex')`,
      }), "result");
    }
    async randomUUID() {
      return val(await call("/eval", {
        code: `require('crypto').randomUUID()`,
      }), "result");
    }
    async base64Encode(args) {
      return val(await call("/eval", {
        code: `Buffer.from(${JSON.stringify(args.TEXT)}).toString('base64')`,
      }), "result");
    }
    async base64Decode(args) {
      return val(await call("/eval", {
        code: `Buffer.from(${JSON.stringify(args.TEXT)}, 'base64').toString('utf8')`,
      }), "result");
    }

    // ── CLIPBOARD ────────────────────────────────────────────────────────────

    async clipboardRead() {
      const plat = (await callGET("/status"))?.platform;
      let cmd;
      if (plat === "win32") cmd = "powershell -command Get-Clipboard";
      else if (plat === "darwin") cmd = "pbpaste";
      else cmd = "xclip -selection clipboard -o";
      const r = await call("/exec", { command: cmd });
      return r?.stdout?.trim() ?? r?.error ?? "";
    }
    async clipboardWrite(args) {
      const plat = (await callGET("/status"))?.platform;
      let cmd;
      if (plat === "win32") cmd = `powershell -command "Set-Clipboard -Value '${args.TEXT.replace(/'/g, "''")}'"`;
      else if (plat === "darwin") cmd = `echo ${JSON.stringify(args.TEXT)} | pbcopy`;
      else cmd = `echo ${JSON.stringify(args.TEXT)} | xclip -selection clipboard`;
      await call("/exec", { command: cmd });
    }

    // ── NOTIFICATIONS ────────────────────────────────────────────────────────

    async sendNotification(args) {
      const plat = (await callGET("/status"))?.platform;
      let cmd;
      if (plat === "win32") {
        cmd = `powershell -command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('${args.MSG}','${args.TITLE}')"`;
      } else if (plat === "darwin") {
        cmd = `osascript -e 'display notification "${args.MSG}" with title "${args.TITLE}"'`;
      } else {
        cmd = `notify-send "${args.TITLE}" "${args.MSG}"`;
      }
      await call("/exec", { command: cmd });
    }
    async openURL(args) {
      const plat = (await callGET("/status"))?.platform;
      let cmd;
      if (plat === "win32") cmd = `start ${args.URL}`;
      else if (plat === "darwin") cmd = `open ${args.URL}`;
      else cmd = `xdg-open ${args.URL}`;
      await call("/exec", { command: cmd });
    }
    async playBeep() {
      const plat = (await callGET("/status"))?.platform;
      if (plat === "win32") {
        await call("/eval", { code: `require('child_process').execSync('[console]::beep(800,300)', {shell:'powershell'})` });
      } else {
        await call("/exec", { command: "printf '\\a'" });
      }
    }

    // ── KEY-VALUE STORE ──────────────────────────────────────────────────────
    // Uses a JSON file at ./sigma_store.json on the server

    async _storeLoad() {
      const r = await call("/fs/read", { path: "sigma_store.json" });
      if (!r.success) return {};
      try { return JSON.parse(r.data); } catch { return {}; }
    }
    async _storeSave(obj) {
      await call("/fs/write", { path: "sigma_store.json", data: JSON.stringify(obj, null, 2) });
    }
    async storeSet(args) {
      const store = await this._storeLoad();
      store[args.KEY] = args.VALUE;
      await this._storeSave(store);
    }
    async storeGet(args) {
      const store = await this._storeLoad();
      return store[args.KEY] !== undefined ? String(store[args.KEY]) : "";
    }
    async storeDelete(args) {
      const store = await this._storeLoad();
      delete store[args.KEY];
      await this._storeSave(store);
    }
    async storeHas(args) {
      const store = await this._storeLoad();
      return args.KEY in store;
    }
    async storeKeys() {
      const store = await this._storeLoad();
      return JSON.stringify(Object.keys(store));
    }
    async storeClear() {
      await this._storeSave({});
    }

    // ── DNS & NETWORKING ─────────────────────────────────────────────────────

    async dnsLookup(args) {
      return val(await call("/eval", {
        code: `await new Promise((res,rej) => require('dns').lookup(${JSON.stringify(args.HOST)}, (e,a) => e ? rej(e) : res(a)))`,
      }), "result");
    }
    async pingHost(args) {
      const r = await call("/fetch", { url: `http://${args.HOST}`, method: "GET" });
      return !!(r && (r.success || r.status));
    }

    // ── SKIBIDI SIGMA EXTRAS ─────────────────────────────────────────────────

    async sigmaRizz() {
      const r = await call("/eval", { code: "Math.floor(Math.random()*101)" });
      const n = parseInt(r?.result ?? "0");
      if (n >= 90) return `${n}/100 — GIGACHAD LEVEL 🗿`;
      if (n >= 70) return `${n}/100 — sigma fr fr 💪`;
      if (n >= 50) return `${n}/100 — mid tbh 😐`;
      return `${n}/100 — cooked bro 💀`;
    }
    async Ohio() {
      const r = await call("/os");
      const host = (r?.hostname ?? "").toLowerCase();
      return host.includes("ohio") ? "yes this is ohio 😨" : "nah we gucci 🙏";
    }
    async executeMatrix() {
      const r = await call("/eval", { code: "Math.random() > 0.5 ? 'red' : 'blue'" });
      const pill = r?.result ?? "blue";
      return pill === "red" ? "🔴 RED PILL — you see the matrix fr" : "🔵 BLUE PILL — stay blissful bestie";
    }
    async brainrot() {
      const quotes = [
        "skibidi toilet ate no cap fr fr",
        "rizz goes brr, ohio stays cringe",
        "gigachad node.js sigma grindset only",
        "touch grass? my server don't touch grass",
        "W rizz, no cap, bussin fr fr on god",
        "bro really eval'd in production 💀",
        "NPC behaviour detected, initiating sigma protocol",
        "only in ohio would the filesystem cry",
        "edge lord? nah i'm edge SERVER 😤",
        "slay bestie, your HTTP response is bussin",
      ];
      const r = await call("/eval", { code: `Math.floor(Math.random()*${quotes.length})` });
      return quotes[parseInt(r?.result ?? "0")] ?? quotes[0];
    }
    async gigachad() {
      const r = await call("/os");
      if (!r?.success) return false;
      // Gigachad criteria: 4+ CPUs, 8GB+ RAM, server alive
      return r.cpus >= 4 && r.totalmem >= 8 * 1024 * 1024 * 1024;
    }
  }

  Scratch.extensions.register(new SigmaBridge());
})(Scratch);