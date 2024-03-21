export default class ticketRepository{
    constructor(dao){
        this.dao = dao
    }

    createTicket = async (ticket) => {
        return this.dao.createTicket(ticket)
    }
}