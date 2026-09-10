#!/usr/bin/env bash
# Закоммитить указанные пути и запушить, переживая гонку с параллельным раннером.
#
#   scripts/commit-and-push.sh "текст коммита" text/ scans/
#
# Воркфлоу запускаются параллельно, поэтому кто-то мог запушить раньше нас.
# Тогда подтягиваем его коммиты ребейзом и пробуем снова.
set -euo pipefail

msg="$1"; shift
branch="${GITHUB_REF_NAME:?не задана ветка}"

git add -- "$@"
if git diff --cached --quiet; then
  echo "Изменений нет."
  exit 0
fi

git config user.name  "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git commit -q -m "$msg"

for attempt in 1 2 3 4 5; do
  if git push -q origin "HEAD:$branch"; then
    echo "Запушено с попытки $attempt."
    exit 0
  fi
  echo "Кто-то опередил, подтягиваю его коммиты (попытка $attempt)."
  # --autostash обязателен: в дереве остаётся рабочий мусор прогона —
  # скачанный PDF, план глав, голоса, отрендеренные страницы, — и без него
  # гит отказывается ребейзить, роняя прогон после часа работы.
  git pull --rebase --autostash -q origin "$branch"
  sleep $(( attempt * 3 ))
done

echo "Пуш не прошёл за пять попыток." >&2
exit 1
