export class createRoomError extends Error{
    private where:string

    constructor(props:{name:string,message:string,where:string,cause:string}){
        super()
        this.cause = props.cause
        this.name= props.name 
        this.message = props.message
        this.where = props.where
    }
}