const API_BASE = "https://rcos-orca.herokuapp.com";

export async function fetchSectionsFromCRNs(
  semesterId: string,
  crns: string[]
) {
  const params = new URLSearchParams();
  crns.forEach((crn) => params.append("crns", crn));
  const response = await fetch(
    `${API_BASE}/${semesterId}/sections?${params.toString()}`
  );
  return await response.json();
}

export async function fetchSemesters() {
  const response = await fetch(`${API_BASE}/semesters`);
  return await response.json();
}
