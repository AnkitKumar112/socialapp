var mailTemplate = {
	from: "Social App<test@techugo.com>",
	subject:"Social App Forgot Password",
	text:`Your OTP is <br> {{OTP}}`
}

var mailTemplateInvitation = {
	from: "Social App<test@techugo.com>",
	subject:"Invitation ",
	text:`Invitation sent`
}

var mail2Template = {
	from: "Tension Tempo<contact@tensiontempo.com>",
	subject:"Tempo Tension Account Activation",
	text:"Hi user,<br><br>Please follow the link to complete the registration process.<a target='_blank' href='http://www.tensiontempo.com:3001/emailVerification?email={{email}}&ctx=recoveraljflksd11243wsfsfdfj&lwv=1104545656464oakasdfioaseoirka&token={{activationToken}}'>Verify Email</a><br><br>Thanks,<br>Team Tension Tempo."
}


var mail3Template = {
	from: "Tension Tempo<contact@tensiontempo.com>",
	subject:"Ebook download link",
	text:"Hi user,<br><br>Please follow the link to download the pdf ebook.<a target='_blank' href='https://www.tensiontempo.com/panel/public/upload/TensionTempo.pdf'>click here to download</a><br><br>Thanks,<br>Team Tension Tempo."
}

module.exports ={
	mailTemplate : mailTemplate,
	mailTemplateInvitation:mailTemplateInvitation,
	mail2Template : mail2Template,
	mail3Template : mail3Template

}