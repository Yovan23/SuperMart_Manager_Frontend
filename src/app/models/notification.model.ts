export interface Notification {
    _id: string;
    messageType: MessageType;
    message: string;
    expiryDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export enum MessageType {
    lowstock = 'lowstock',
    expire = 'expire',
    highsale = 'highsale',
}