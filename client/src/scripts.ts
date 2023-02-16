import { io } from "socket.io-client";
import { SERVER_URL } from "./config";

export function ObjectId () {
    const m = Math;
    const d = Date;
    const h = 16;
    const s = (s: number) => m.floor(s).toString(h);
    return s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
} 

export const socket = io(SERVER_URL);

export interface SocketData<Type=any> {
    tag?: string;
    status: 200 | 404 | 500;
    data: Type;
}

class SocketPromise {
    id: string;
    res: (data: SocketData) => void;
    constructor (res: (data: SocketData) => void) {
        this.id = ObjectId();
        this.res = res;
    }
}

class Tag<Type=any> {

    static list: { [tag: string]: Tag } = {};

    tag: string;
    promises: { [id: string]: SocketPromise } = {};

    constructor (tag: string) {
        socket.on(tag, (data: SocketData) => {
            for(const id in this.promises) {
                const { res } = this.promises[id];
                delete this.promises[id];
                res(data);
            }
        });
        this.tag = tag;
        Tag.list[tag] = this;
    }

    get (data: void) {
        socket.emit(this.tag, data);
        return new Promise<SocketData<Type>>(res => {
            const p = new SocketPromise(res);
            this.promises[p.id] = p;
        });
    }

}

export async function socketRequest<Type=any> (tagName: string, data: any) {
    const tag = Tag.list[tagName] ?? new Tag(tagName);
    return await tag.get(data) as SocketData<Type>;
}

export type Mutable<Type> = {
    -readonly [K in keyof Type]: Type[K];
}


export function CopyObject<Type> (obj: Type) {
    return JSON.parse(JSON.stringify(obj)) as Type;
}

export function isMobile () {
    return window.innerWidth <= 800;
}