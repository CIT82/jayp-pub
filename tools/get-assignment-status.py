from urllib.parse import quote

import requests

from config import GITHUB_PERSONAL_ACCESS_TOKEN

headers = {
	"Accept": "application/vnd.github+json",
	"Authorization": f"Bearer {GITHUB_PERSONAL_ACCESS_TOKEN}",
	"X-GitHub-Api-Version": "2026-03-10",
}

ORG = "CIT82"
URL = f"https://api.github.com/orgs/{ORG}/repos"

assignments = [
	(
		"Week 02 Attendance",
		"screenshots",
		"w2-attend.",
	),
	(
		"Week 02 Project",
		"w2",
		"index.html",
	),
]

repos = []
page = 1

while True:
	response = requests.get(
		URL,
		headers=headers,
		params={
			"type": "public",
			"sort": "full_name",
			"direction": "asc",
			"per_page": 100,
			"page": page,
		},
		timeout=30,
	)
	response.raise_for_status()

	batch = response.json()

	if not batch:
		break

	repos.extend(batch)

	if len(batch) < 100:
		break

	page += 1

for repo in repos:
	repo_name = repo["name"]

	if not repo_name.endswith("-pub"):
		continue

	print(repo_name)

	default_branch = quote(repo["default_branch"], safe="")
	tree_url = (
		f"https://api.github.com/repos/{ORG}/{repo_name}/git/trees/{default_branch}"
	)

	response = requests.get(
		tree_url,
		headers=headers,
		params={"recursive": "1"},
		timeout=30,
	)
	response.raise_for_status()

	tree_data = response.json()

	if tree_data.get("truncated"):
		raise RuntimeError(f"Repository tree for {repo_name} was truncated")

	tree = tree_data["tree"]

	for index, (assignment_name, path, sentinel_prefix) in enumerate(assignments):
		target_prefix = f"{path.strip('/')}/{sentinel_prefix}"

		found = any(
			item["type"] == "blob"
			and item["path"].startswith(target_prefix)
			for item in tree
		)

		status = "done" if found else "pending"

		is_last = index == len(assignments) - 1
		branch = "└──" if is_last else "├──"

		print(f"{branch} {assignment_name}: {status}")

print()
print("Token Query Limit:", response.headers["X-RateLimit-Limit"])
print("Queries Remaining:", response.headers["X-RateLimit-Remaining"])
