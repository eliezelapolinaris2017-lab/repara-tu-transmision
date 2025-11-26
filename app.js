// app.js
// Lógica de la biblioteca: filtros, listado, visor PDF e impresión.

// Referencias al DOM
const searchInput = document.getElementById("searchInput");
const brandFilter = document.getElementById("brandFilter");
const categoryFilter = document.getElementById("categoryFilter");
const manualList = document.getElementById("manualList");
const pdfViewer = document.getElementById("pdfViewer");
const viewerTitle = document.getElementById("viewerTitle");
const viewerMeta = document.getElementById("viewerMeta");
const printBtn = document.getElementById("printBtn");

let manualSeleccionado = null;

// ====== INICIALIZACIÓN ======
document.addEventListener("DOMContentLoaded", () => {
  if (!Array.isArray(MANUALES)) {
    console.error("MANUALES no está definido o no es un arreglo. Revisa manuals.js");
    return;
  }

  poblarFiltros();
  renderManualList(MANUALES);

  // Eventos
  searchInput.addEventListener("input", aplicarFiltros);
  brandFilter.addEventListener("change", aplicarFiltros);
  categoryFilter.addEventListener("change", aplicarFiltros);
  printBtn.addEventListener("click", imprimirPDFActual);
});

// ====== FUNCIONES PRINCIPALES ======

function poblarFiltros() {
  const marcas = new Set();
  const categorias = new Set();

  MANUALES.forEach(m => {
    if (m.marca) marcas.add(m.marca);
    if (m.categoria) categorias.add(m.categoria);
  });

  // Poblar marcas
  [...marcas].sort().forEach(marca => {
    const opt = document.createElement("option");
    opt.value = marca;
    opt.textContent = marca;
    brandFilter.appendChild(opt);
  });

  // Poblar categorías
  [...categorias].sort().forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

function aplicarFiltros() {
  const texto = searchInput.value.trim().toLowerCase();
  const marca = brandFilter.value;
  const categoria = categoryFilter.value;

  const filtrados = MANUALES.filter(m => {
    let coincideTexto = true;
    let coincideMarca = true;
    let coincideCategoria = true;

    if (texto) {
      const blob = (
        (m.titulo || "") + " " +
        (m.marca || "") + " " +
        (m.modelo || "") + " " +
        (m.palabrasClave || "")
      ).toLowerCase();
      coincideTexto = blob.includes(texto);
    }

    if (marca) {
      coincideMarca = (m.marca === marca);
    }

    if (categoria) {
      coincideCategoria = (m.categoria === categoria);
    }

    return coincideTexto && coincideMarca && coincideCategoria;
  });

  renderManualList(filtrados);
}

function renderManualList(lista) {
  manualList.innerHTML = "";

  if (!lista.length) {
    const empty = document.createElement("div");
    empty.className = "manual-item";
    empty.innerHTML = `
      <div class="manual-title">Sin resultados</div>
      <div class="manual-meta">Ajusta los filtros o la búsqueda.</div>
    `;
    manualList.appendChild(empty);
    return;
  }

  lista.forEach(m => {
    const item = document.createElement("article");
    item.className = "manual-item";
    item.dataset.id = m.id;

    const titulo = document.createElement("div");
    titulo.className = "manual-title";
    titulo.textContent = m.titulo || "Manual sin título";

    const meta = document.createElement("div");
    meta.className = "manual-meta";
    meta.textContent = [
      m.marca || "Marca desconocida",
      m.modelo || "",
      m.categoria || ""
    ].filter(Boolean).join(" · ");

    const tags = document.createElement("div");
    tags.className = "manual-tags";
    if (m.anio) {
      tags.textContent = `Año: ${m.anio}`;
    } else {
      tags.textContent = "";
    }

    item.appendChild(titulo);
    item.appendChild(meta);
    if (tags.textContent) item.appendChild(tags);

    item.addEventListener("click", () => {
      seleccionarManual(m.id);
    });

    manualList.appendChild(item);
  });

  // Si hay un manual seleccionado que aún está en la lista, marcarlo
  if (manualSeleccionado) {
    const found = lista.find(m => m.id === manualSeleccionado.id);
    if (found) marcarManualActivo(found.id);
  }
}

function seleccionarManual(id) {
  const manual = MANUALES.find(m => m.id === id);
  if (!manual) {
    console.warn("Manual no encontrado:", id);
    return;
  }

  manualSeleccionado = manual;
  marcarManualActivo(id);

  // Actualizar info del visor
  viewerTitle.textContent = manual.titulo || "Manual sin título";
  viewerMeta.textContent = [
    manual.marca || "Marca desconocida",
    manual.modelo || "",
    manual.categoria || "",
    manual.anio ? `Año ${manual.anio}` : ""
  ].filter(Boolean).join(" · ");

  // Cargar PDF en iframe
  if (manual.file) {
    // OJO: el archivo debe existir en esa ruta dentro del repositorio.
    pdfViewer.src = manual.file;
    printBtn.disabled = false;
  } else {
    pdfViewer.src = "";
    printBtn.disabled = true;
  }
}

function marcarManualActivo(id) {
  const items = manualList.querySelectorAll(".manual-item");
  items.forEach(item => {
    if (Number(item.dataset.id) === id) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function imprimirPDFActual() {
  if (!manualSeleccionado || !pdfViewer.src) {
    return;
  }

  try {
    // Esto funciona mejor si el PDF está en el mismo dominio/origen (misma web / mismo GitHub Pages)
    const frameWindow = pdfViewer.contentWindow;
    if (frameWindow) {
      frameWindow.focus();
      frameWindow.print();
    } else {
      // Plan B: abrir en nueva pestaña y que el usuario imprima manualmente
      window.open(pdfViewer.src, "_blank");
    }
  } catch (err) {
    console.error("No se pudo imprimir directamente:", err);
    window.open(pdfViewer.src, "_blank");
  }
}
