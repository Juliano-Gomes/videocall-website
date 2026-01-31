export class InterfaceLayerError extends Error{
    private where:string
    private statusCode:number
    constructor(props:{name:string,message:string,where:string,cause:string,statusCode:number}){
        super()
        this.name = props.name
        this.cause=props.cause
        this.message=props.message
        this.where = props.where
        this.statusCode=props.statusCode || 500
    }
}