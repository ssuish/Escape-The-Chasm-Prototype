interface IStateConfig {
    name?: string;
    onEnter?: () => void;
    onUpdate?: (deltaTime: number) => void;
    onExit?: () => void;
}

export default class StateMachine {
    private context?: unknown;
    private id: string;
    private states = new Map<string, IStateConfig>();
    private currentState?: IStateConfig;
    private isSwitchingState: boolean = false;
    private stateQueue: string[] = [];

    constructor(context?: unknown, name?: string) {
        this.context = context;
        this.id = name ?? "default";
    }

    isCurrentState(name: string) {
        if (!this.currentState) {
            return false;
        }

        return this.currentState.name === name;
    }

    addState(name: string, config: IStateConfig) {
        this.states.set(name, {
            name,
            onEnter: config?.onEnter?.bind(this.context),
            onUpdate: config?.onUpdate?.bind(this.context),
            onExit: config?.onExit?.bind(this.context),
        });

        return this;
    }

    setState(name: string) {
        if (!this.states.has(name)) {
            return;
        }

        if (this.isSwitchingState) {
            this.stateQueue.push(name);
            return;
        }

        this.isSwitchingState = true;

        if (this.currentState && this.currentState.onExit) {
            this.currentState.onExit();
        }

        // Error logging on states switching
        if (this.currentState?.name !== name) {
            console.log(`Object ${this.id} Switching state to: ${name}`);
        }

        this.currentState = this.states.get(name);

        if (this.currentState?.onEnter) {
            this.currentState.onEnter();
        }

        this.isSwitchingState = false;

        return this;
    }

    update(deltaTime: number) {
        if (this.stateQueue.length > 0) {
            const name = this.stateQueue.shift()!;
            this.setState(name);
            return;
        }

        if (!this.currentState) {
            return;
        }

        if (this.currentState.onUpdate) {
            this.currentState.onUpdate(deltaTime);
        }
    }
}

