const createKey = (name: string, id: number) => `${name}-${id}`;

export default class CollisionIdentifier {
    private obstacles = new Map<string, MatterJS.BodyType>();

    add(name: string, body: MatterJS.BodyType) {
        const key = createKey(name, body.id);
        if (this.obstacles.has(key)) {
            throw new Error(`Obstacle with key ${key} already exists.`);
        }
        this.obstacles.set(key, body);
    }

    remove(name: string, body: MatterJS.BodyType) {
        const key = createKey(name, body.id);
        if (this.obstacles.has(key)) {
            throw new Error(`Obstacle with key ${key} does not exist.`);
        }
        this.obstacles.delete(key);
    }

    is(name: string, body: MatterJS.BodyType) {
        const key = createKey(name, body.id);
        return this.obstacles.has(key);
    }
}


