export const getChatGeneral = async (req, res) => {
  res.render(`./chatGeneral`, {
    id: req.user.id,
    nombre: req.user.username,
    pic: req.user.pic,
  });
};

export const getChatIndividual = async (req, res) => {
  res.render(`./chatIndividual`, {
    id: req.user.id,
    nombre: req.user.username,
    pic: req.user.pic,
    destinatario: req.params.destinatario,
  });
};
