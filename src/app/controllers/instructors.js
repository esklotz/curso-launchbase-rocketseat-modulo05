const {age, date} = require('../../lib/utils')
const instructor = require('../models/instructor')

module.exports = {
    index(req, res) {
        let {filter, page, limit} = req.query 

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(instrutores) {

                let totalInstrutores
                if(instrutores.length > 0 ){
                    totalInstrutores = instrutores[0].total
                } else {
                    totalInstrutores = 0
                }
                
                const pagination = {
                    total: Math.ceil(totalInstrutores / limit),
                    page
                }
                return res.render("instructors/index", {instrutores, pagination, filter})
            }
        }

        instructor.paginate(params)
       
    },
    post(req, res) {
        const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
        }
    }

    instructor.create(req.body, function(instructor) {
        return res.redirect(`/instructors/${instructor.id}`)
    })

    },
    show(req, res) {
       instructor.find(req.params.id, function(instrutor){
           if(!instrutor) return res.send("Instructor not found!")

           instrutor.age = age(instrutor.birth)
           instrutor.services = instrutor.services.split(",")
           instrutor.created_at = date(instrutor.created_at).format

           return res.render("instructors/show", {instrutor})
       })
    },
    create(req, res) {
        return res.render("instructors/create")
    },
    edit(req, res) {
        instructor.find(req.params.id, function(instrutor){
            if(!instrutor) return res.send("Instructor not found!")
 
            instrutor.birth = date(instrutor.birth).iso
          
            return res.render("instructors/edit", {instrutor})
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
            if(req.body[key] == "") {
                return res.send("Please, fill all fields")
            }
        }

        instructor.update (req.body, function(){
            return res.redirect(`/instructors/${req.body.id}`)
        })
    },
    delete(req, res) {
        instructor.delete (req.body.id, function(){
            return res.redirect(`/instructors`)
        })
    },
}
