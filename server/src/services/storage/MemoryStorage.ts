import { Service } from "@tsed/common";
/**
 * To server a key value pair singleton memory service
 */
@Service()
export class MemoryStorage {

    private states: Map<string, string> = new Map<string, string>();

    constructor() {

    }

    /**
     * 
     * @param key name of the key that needs to be retrived
     */
    public get<T>(key: string): T {
        return JSON.parse(this.states.get(key));
    }

    /**
     * 
     * @param key key to be stored/replaced
     * @param value value to be stored
     */
    public set(key: string, value: any) {
        return this.states.set(key, JSON.stringify(value));
    }
}