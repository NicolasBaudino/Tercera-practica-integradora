import { ticketModel } from "../../../models/ticket.model.js"

export default class ticketDAO {
    async createTicket(ticket){
        return await ticketModel.create(ticket)
    }
}