import {
  getUserCurrent as getUserCurrentService,
  getUserById as getUserByIdService,
  updatePremiumStatus as updatePremiumStatusService,
} from "../services/users.service.js";

export const getUserCurrent = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await getUserCurrentService(email);
    return res.status(200).send({ status: "success", payload: user });
  } catch (error) {
    return res.send({ status: "error", error: error });
  }
};

export const updatePremiumStatus = async (req, res) => {
  try {
    const { uid } = req.params;

    // Obtener el usuario y sus documentos
    const user = await getUserByIdService(uid);
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", message: "User not found" });
    }

    // Verificar si el usuario tiene todos los documentos requeridos cargados
    const requiredDocuments = [
      "Identificación",
      "Comprobante de domicilio",
      "Comprobante de estado de cuenta",
    ];
    const hasAllDocuments = requiredDocuments.every((doc) =>
      user.documents.some((d) => d.name === doc)
    );
    if (!hasAllDocuments) {
      return res
        .status(400)
        .send({
          status: "error",
          message: "El usuario no ha cargado todos los documentos requeridos",
        });
    }

    // Verificar si el usuario ya es premium o admin
    if (user.role === "admin") {
      return res
        .status(400)
        .send({ status: "error", message: "User is Admin" });
    }

    // Actualizar al usuario a premium
    const newRole = user.role === "user" ? "premium" : "user";
    const result = await updatePremiumStatusService(uid, newRole);

    return res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
