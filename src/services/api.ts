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
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(response.statusText);
  }
}

export async function fetchSemesters() {
  const response = await fetch(`${API_BASE}/semesters`);
  return await response.json();
}
