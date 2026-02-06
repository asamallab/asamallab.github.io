const topicFilter = document.getElementById("topicFilter");
const authorFilter = document.getElementById("authorFilter");
const yearFilter = document.getElementById("yearFilter");
const clearBtn = document.getElementById("clearFilters");
const publications = document.querySelectorAll(".pub-item");

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[-.]/g, " ")   // remove dots & hyphens
    .replace(/\s+/g, " ")   // normalize spaces
    .trim();
}

function filterPublications() {
  const topic = normalize(topicFilter.value);
  const author = normalize(authorFilter.value);
  const year = yearFilter.value.trim();

  publications.forEach(pub => {
    const pubTopic = normalize(pub.dataset.topic || "");

    // 🔑 AUTHOR SOURCE FIX
    const rawAuthors =
      pub.dataset.authors ||
      pub.textContent || "";   // fallback if missing

    const pubAuthors = normalize(rawAuthors);
    const pubYear = pub.dataset.year || "";

    const topicMatch = !topic || pubTopic.includes(topic);
    const authorMatch = !author || pubAuthors.includes(author);
    const yearMatch = !year || pubYear.includes(year);

    pub.style.display =
      topicMatch && authorMatch && yearMatch ? "block" : "none";
  });
}



// function filterPublications() {
//   const topic = topicFilter.value.toLowerCase().trim();
//   const author = authorFilter.value.toLowerCase().trim();
//   const year = yearFilter.value.trim();

//   publications.forEach(pub => {
//     const pubTopic = (pub.dataset.topic || "").toLowerCase();
//     const pubAuthors = (pub.dataset.authors || "").toLowerCase();
//     const pubYear = pub.dataset.year || "";

//     const topicMatch = !topic || pubTopic.includes(topic);

//         const authorMatch = !author
//       ? true
//       : pubAuthors
//           .replace(/\./g, "")
//           .replace(/,/g, " ")
//           .replace(/\s+/g, " ")
//           .includes(author);
//     // 🔑 YEAR FIX
//     const yearMatch = !year
//       ? true
//       : pubYear
//         ? pubYear.includes(year)
//         : false;

//     pub.style.display =
//       topicMatch && authorMatch && yearMatch ? "block" : "none";
//   });
// }

/* Live filtering */
topicFilter.addEventListener("change", filterPublications);
authorFilter.addEventListener("input", filterPublications);
yearFilter.addEventListener("input", filterPublications);

/* Clear filters */
clearBtn.addEventListener("click", () => {
  topicFilter.value = "";
  authorFilter.value = "";
  yearFilter.value = "";
  filterPublications();
});

/* Default load */
document.addEventListener("DOMContentLoaded", filterPublications);
