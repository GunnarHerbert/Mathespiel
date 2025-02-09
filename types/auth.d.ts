declare module '#auth-utils' {
    interface User {
        username?: string;
        grade?: number;
        isCurrentTaskSolved?: number;
        rank?: number;
        points?: number;
        crystals?: number;
    }
}

export {};