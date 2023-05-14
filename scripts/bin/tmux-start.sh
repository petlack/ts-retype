#!/bin/bash

WORKING_DIR=$PWD

if [ -z "$TMUX" ]; then
	SESSION_NAME="tmux-dev"
	tmux new-session -d -s $SESSION_NAME -c "$WORKING_DIR"
else
	tmux new-window -c "$WORKING_DIR"
	SESSION_NAME=$(tmux display-message -p '#S')
fi
tmux split-window -h -c "$WORKING_DIR"
tmux select-pane -t 1
tmux split-window -v -c "$WORKING_DIR"
tmux split-window -v -c "$WORKING_DIR"
tmux select-pane -t 4
tmux split-window -v -c "$WORKING_DIR"
tmux split-window -v -c "$WORKING_DIR"
tmux send-keys -t 1 "npm -w clikit run watch" C-m
tmux send-keys -t 2 "npm -w retype run watch" C-m
tmux send-keys -t 3 "npm -w scripts run watch" C-m
tmux send-keys -t 4 "npm -w vis run dev" C-m
tmux send-keys -t 5 "npm -w docs run dev" C-m
tmux send-keys -t 6 "npm -w uikit run dev" C-m
if [ -z "$TMUX" ]; then
	tmux attach-session -t "$SESSION_NAME"
else
	tmux select-window -t "$(tmux display-message -p '#I')"
fi