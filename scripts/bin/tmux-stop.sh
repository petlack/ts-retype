#!/bin/bash

# Check if we are in a tmux session
if [ -z "$TMUX" ]; then
	# Not in a tmux session
	tmux kill-window -t unique_window_name
else
	# In a tmux session
	tmux kill-window -t $(tmux display-message -p '#S'):unique_window_name
fi
