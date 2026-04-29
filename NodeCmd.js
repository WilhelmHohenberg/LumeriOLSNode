(function (Scratch) {
  "use strict";

  const SERVER = "http://localhost:43210";

  async function call(endpoint, body = null) {
    try {
      const res = await fetch(SERVER + endpoint, {
        method: body ? "POST" : "GET",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined
      });

      const text = await res.text();

      try {
        return JSON.parse(text);
      } catch {
        return { success: false, error: "NOT JSON: " + text.slice(0, 100) };
      }

    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function unwrap(r, key) {
    if (!r || !r.success) return r?.error || "error";
    return r[key] !== undefined ? String(r[key]) : JSON.stringify(r);
  }

  class TestExtension {
    getInfo() {
      return {
        id: "nodeTest",
        name: "Node Test",
        color1: "#4CAF50",
        color2: "#2E7D32",

        blocks: [

          // ✅ CONNECTION
          {
            opcode: "isAlive",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "node server working?"
          },

          // 📊 STATUS INFO
          {
            opcode: "getVersion",
            blockType: Scratch.BlockType.REPORTER,
            text: "node version"
          },
          {
            opcode: "getPlatform",
            blockType: Scratch.BlockType.REPORTER,
            text: "platform"
          },
          {
            opcode: "getUptime",
            blockType: Scratch.BlockType.REPORTER,
            text: "server uptime"
          },

          // 📁 FILE
          {
            opcode: "readFile",
            blockType: Scratch.BlockType.REPORTER,
            text: "read file [PATH]",
            arguments: {
              PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "test.txt" }
            }
          },
          {
            opcode: "writeFile",
            blockType: Scratch.BlockType.COMMAND,
            text: "write [DATA] to [PATH]",
            arguments: {
              DATA: { type: Scratch.ArgumentType.STRING, defaultValue: "hello" },
              PATH: { type: Scratch.ArgumentType.STRING, defaultValue: "test.txt" }
            }
          },

          // 💻 COMMAND
          {
            opcode: "runCommand",
            blockType: Scratch.BlockType.REPORTER,
            text: "run command [CMD]",
            arguments: {
              CMD: { type: Scratch.ArgumentType.STRING, defaultValue: "echo hi" }
            }
          },

          // 🌐 HTTP
          {
            opcode: "httpGet",
            blockType: Scratch.BlockType.REPORTER,
            text: "GET [URL]",
            arguments: {
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: "https://example.com" }
            }
          }

        ]
      };
    }

    // ✅ CONNECTION
    async isAlive() {
      const r = await call("/status");
      return !!(r && r.success);
    }

    // 📊 STATUS
    async getVersion() {
      const r = await call("/status");
      return unwrap(r, "version");
    }

    async getPlatform() {
      const r = await call("/status");
      return unwrap(r, "platform");
    }

    async getUptime() {
      const r = await call("/status");
      return unwrap(r, "uptime");
    }

    // 📁 FILE
    async readFile(args) {
      const r = await call("/fs/read", { path: args.PATH });
      return unwrap(r, "data");
    }

    async writeFile(args) {
      await call("/fs/write", {
        path: args.PATH,
        data: args.DATA
      });
    }

    // 💻 COMMAND
    async runCommand(args) {
      const r = await call("/exec", { command: args.CMD });
      return r?.stdout || r?.error || "error";
    }

    // 🌐 HTTP
    async httpGet(args) {
      const r = await call("/fetch", {
        url: args.URL,
        method: "GET"
      });
      return unwrap(r, "body");
    }

  }

  Scratch.extensions.register(new TestExtension());

})(Scratch);
