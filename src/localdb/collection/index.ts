export class Collection<T extends Object = {}> {

    public readonly name: string

    private database: T[]

    constructor(name: string) {
        this.name = name
        this.database = []
    }

    

    public async create(o: T) {
        this.database.push(o)
    }

    public async find(predicate: (value: T) => value is T) {
        return this.database.find(predicate)
    }

    public async delete(predicate: (value: T) => boolean) {
        this.database = this.database.filter(v => predicate(v))
    }
}