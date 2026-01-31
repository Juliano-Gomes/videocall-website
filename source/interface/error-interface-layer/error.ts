export class InterfaceLayerError extends Error{
    private where:string
    constructor(props:{name:string,message:string,where:string,cause:string}){
        super()
        this.name = props.name
        this.cause=props.cause
        this.message=props.message
        this.where = props.where
    }
}