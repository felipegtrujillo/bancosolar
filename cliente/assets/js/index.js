
  function setInfoModal (nombre, balance, id) {

    $("#nombreEdit").val(nombre);
    $("#balanceEdit").val(balance);
    $("#editButton").attr("onclick", `editUsuario('${id}')`);
  };

  async function eliminarUsuario(id){ 
    try {
    const response = await fetch(`http://localhost:4000/usuario/borrar?id=${id}`, {
      method: "DELETE",
    });

      console.log("response", response);
     if (response.status === 200) {
      console.log("Usuario eliminado correctamente");
    }
  } catch (e) {
    console.log("Algo salió mal al borrar el registro..." + e);
}

   /*  getUsuarios(); */
   location.reload();
    
  };

  async function editUsuario(id) {
    const name = $("#nombreEdit").val();
    const balance = $("#balanceEdit").val();
    try {
      const { data } = await axios.put(
        `http://localhost:4000/usuario/editar?id=${id}`,
        {
          name,
          balance,
        }
      );
 
      if (data.status === 200) {
        console.log("Usuario editado correctamente");
      }
      $("#exampleModal").modal("hide");
      location.reload();
    } catch (e) {
      alert("Algo salió mal..." + e);
    }
  };


  document.addEventListener('DOMContentLoaded', () => {

  $("form:first").submit(async (e) => {
    e.preventDefault();

    let nombre = $("form:first input:first").val();
    let balance = Number($("form:first input:nth-child(2)").val());
    
    try {
      const response = await fetch("http://localhost:4000/usuario/crear", {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
          nombre: nombre,
          balance: balance,
        }),
      });

      $("form:first input:first").val("");
      $("form:first input:nth-child(2)").val("");
      location.reload();
    } catch (e) {
      alert("Algo salió mal ..." + e);
    }
  });

  $("form:last").submit(async (e) => {
    e.preventDefault();
    let emisor = $("form:last select:first").val();
    let receptor = $("form:last select:last").val();
    let monto = $("#monto").val();
    if (!monto || !emisor || !receptor) {
      alert("Debe seleccionar un emisor, receptor y monto a transferir");
      return false;
    }
    try {
      const response = await fetch("http://localhost:4000/transferencia/crear", {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
          emisor,
          receptor,
          monto,
        }),
      });
      const data = await response.json();

      if (data.status === '200') {
        console.log("Transaccion realizada correctamente.");
      }
      else {
        console.log("status:", data.status, "mensaje", data.mensaje);
        alert(data.mensaje)
      }
       location.reload();
    } catch (error) {
      console.log(error);
      alert("Algo salió mal..." + error);
    }
  });

  const getUsuarios = async () => {
    const response = await fetch("http://localhost:4000/usuario/");
    let data = await response.json();
    $(".usuarios").html("");

    const usuarios =  data.data;


    $.each(usuarios, (index, item) => {
        console.log("item", item );
      $(".usuarios").append(`
              <tr>
                <td>${item.nombre}</td>
                <td>${item.balance}</td>
                <td>
                  <button
                    class="btn btn-warning mr-2"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onclick="setInfoModal('${item.nombre}', '${item.balance}', '${item.id}')"> Editar</button
                  ><button class="btn btn-danger" onclick="eliminarUsuario('${item.id}')">Eliminar</button>
                </td>
              </tr>
         `);

      $("#emisor").append(`<option value="${item.id}">${item.nombre}</option>`);
      $("#receptor").append(`<option value="${item.id}">${item.nombre}</option>`);
    });
  };


  const getTransferencias = async () => {
    const { data } = await axios.get("http://localhost:4000/transferencia/");
   
    console.log("data", data.data);

    const transferencias = Object.values(data.data);
    console.log("transferencias", transferencias);

    $(".transferencias").html("");

    transferencias.forEach((arreglo) => {
      $(".transferencias").append(`
       <tr>
         <td> ${formatDate(arreglo.fecha)} </td>
         <td> ${arreglo.emisor} </td>
         <td> ${arreglo.receptor} </td>
         <td> ${arreglo.monto} </td>
       </tr>
     `);
    });
  };

  getUsuarios();
  getTransferencias();

  const formatDate = (date) => {
    const dateFormat = moment(date).format("L");
    const timeFormat = moment(date).format("LTS");
    return `${dateFormat} ${timeFormat}`;
  };
  formatDate();

});
