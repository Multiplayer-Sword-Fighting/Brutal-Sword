class DebugPanel extends pc.ScriptType {

    initialize() {
        this.text = this.entity.element;
        this.app.on('frameupdate', this.begin.bind(this, 'update'));
        pc.app.on('framerender', this.mark.bind(this, 'render'));
        pc.app.on('frameend', this.mark.bind(this, 'other'));
        pc.app.graphicsDevice.gpuProfiler.enabled = true;        
    }


    update(){
        //pc.app.root.findByName("statsTexture").element.texture =miniStats.render2d;
        //if (this.debugPanel) 
   
        let mem = window.performance.memory.usedJSHeapSize;
        let fps = pc.app.stats.frame.fps;
        let drawCalls = pc.app.stats.drawCalls.total;
        let gpuTime =  pc.app.graphicsDevice.gpuProfiler._frameTime
        let phys = pc.app.systems.rigidbody._stats.updateTime;
        //this.text.text = `Memory: ${mem}\nFPS: ${fps}\nDraw Calls: ${drawCalls}\nCPU Time: ${this.lastTiming}\nGPU Time: ${gpuTime}`;
        this.text.text = `FPS: ${fps}\nDraw Calls: ${drawCalls}\n`;
        
    }

        
    
    
    begin() {
        this.lastTiming = pc.now();
    }

    mark() {
        this.lastTiming = pc.now() - this.lastTiming;
    }
}

pc.registerScript(DebugPanel, 'DebugPanel');