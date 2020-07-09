const {age, date} = require('../../lib/utils')
const member = require('../models/member')

module.exports = {
    index(req, res) {
        member.all(function(members) {
            return res.render("members/index", {members})
            })
    },
    post(req, res) {
        const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
        return res.send('Por favor, preencha todos os campos!')
        }
    }

    member.create(req.body, function(member) {
        return res.redirect(`/members/${member.id}`)
    })

    },
    show(req, res) {
       member.find(req.params.id, function(member){
           if(!member) return res.send("member not found!")

           member.birth = date(member.birth).birthDay
           
           return res.render("members/show", {member})
       })
    },
    create(req, res) {
        return res.render("members/create")
    },
    edit(req, res) {
        member.find(req.params.id, function(member){
            if(!member) return res.send("member not found!")
 
            member.birth = date(member.birth).iso
          
            return res.render("members/edit", {member})
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
            if(req.body[key] == "") {
                return res.send("Please, fill all fields")
            }
        }

        member.update (req.body, function(){
            return res.redirect(`/members/${req.body.id}`)
        })
    },
    delete(req, res) {
        member.delete (req.body.id, function(){
            return res.redirect(`/members`)
        })
    },
}