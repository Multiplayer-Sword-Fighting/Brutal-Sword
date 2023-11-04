
var MeshCombiner = class extends bs {
    initialize() {
        // Create a new BatchManager instance
        var device = this.app.graphicsDevice;
        var root = this.app.root;
        var scene = this.app.scene;
        var batchManager = new pc.BatchManager(device, root, scene);
        batchManager.rootNode

        // Create a new batch group
        var batchGroupId = batchManager.addGroup("MyBatchGroup", false, 10000);

        // Assign the batch group to the model components of your entities
        entity1.model.batchGroupId = batchGroupId;
        entity2.model.batchGroupId = batchGroupId;
        // ... do this for all entities you want to batch
        
        // Generate the batches
        batchManager.generate([batchGroupId]);
    }
}

pc.registerScript(MeshCombiner, 'MeshCombiner');