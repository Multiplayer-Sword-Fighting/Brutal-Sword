if (window.location.href.indexOf("stats") > -1) {
    let opt = pcx.MiniStats.getDefaultOptions();
    opt.stats[0].stats[0] = 'frame.fps'
    new pcx.MiniStats(pc.app, opt)
}

class DebugPanel extends pc.ScriptType {

    initialize() {
        this.text = this.entity.element;
        this.app.on('frameupdate', this.begin.bind(this, 'update'));
        pc.app.on('framerender', this.mark.bind(this, 'render'));
        pc.app.on('frameend', this.mark.bind(this, 'other'));
        //pc.app.graphicsDevice.gpuProfiler.enabled = true;        


        setInterval(() => {
            let fps = pc.app.stats.frame.fps;
            let drawCalls = pc.app.stats.drawCalls.total;
            //   let gpuTime =  pc.app.graphicsDevice.gpuProfiler._frameTime
            //let phys = pc.app.systems.rigidbody._stats.physicsTime.toFixed(2);
            this.text.text = `\nFPS: ${fps}\nDraw Calls: ${drawCalls}\nCPU Time: ${this.cpuTime}`;


        }, 500);
    } 


    update() {
        //pc.app.root.findByName("statsTexture").element.texture =miniStats.render2d;
        //if (this.debugPanel) 


        //this.text.text = `FPS: ${fps}\nDraw Calls: ${drawCalls}\n`;

    }




    begin() {
        this.lastTiming = pc.now();
    }

    mark() {
        this.cpuTime = (pc.now() - this.lastTiming).toFixed(2);
    }
}

pc.registerScript(DebugPanel, 'DebugPanel'); 