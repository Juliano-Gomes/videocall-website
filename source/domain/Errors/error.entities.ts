export class createRoomError extends Error{
    private where:string
    private statusCode:number

    constructor(props:{name:string,message:string,statusCode:number,where:string,cause:string}){
        super()
        this.cause = props.cause
        this.name= props.name 
        this.message = props.message
        this.where = props.where
        this.statusCode=props.statusCode
    }
}