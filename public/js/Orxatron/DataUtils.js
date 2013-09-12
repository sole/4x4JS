// Extract relevant information for our purposes only
function renoiseToOrxatron(json) {
	var j = {};
	var song = json.RenoiseSong;

	j.bpm = song.GlobalSongData.BeatsPerMin;
	j.orders = [];

	// Order list
	var entries = song.PatternSequence.SequenceEntries.SequenceEntry;

	// It's an array -> more than one entry
	if(entries.indexOf) {
		entries.forEach(function(entry) {
			j.orders.push(entry.Pattern | 0);
		});
	} else {
		if(entries.Pattern !== undefined) {
			j.orders.push(entry.Pattern | 0);
		}
	}

	// find out how many tracks and how many columns per track
	var patterns = song.PatternPool.Patterns.Pattern;
	var tracksSettings = [];

	patterns.forEach(function(pattern, patternIndex) {

		var tracks = pattern.Tracks.PatternTrack;

		tracks.forEach(function(track, trackIndex) {

			var lines = track.Lines && track.Lines.Line ? track.Lines.Line : [];
			
			if(tracksSettings[trackIndex] === undefined) {
				tracksSettings[trackIndex] = 0;
			}

			// Just one line
			if(lines.forEach === undefined) {
				lines = [ lines ];
			}

			lines.forEach(function(line, lineIndex) {
				var noteColumns;
				var numColumns;

				// Not all lines contain necessarily note columns--there could be EffectColumns instead
				if(line.NoteColumns !== undefined) {
					noteColumns = line.NoteColumns.NoteColumn;

					if(noteColumns.indexOf) {
						numColumns = noteColumns.length;
					} else {
						numColumns = 1;
					}
				} else {
					numColumns = 1;
				}
				tracksSettings[trackIndex] = Math.max(numColumns, tracksSettings[trackIndex]);
			});

			// But there's always a minimum of one column per track
			tracksSettings[trackIndex] = Math.max(1, tracksSettings[trackIndex]);

		});

	});

	j.tracks = tracksSettings;

	// Now extract notes and stuff we care about
	j.patterns = [];

	patterns.forEach(function(pattern) {
		var p = {};
		var data = [];
		
		p.tracks = data;
		p.rows = pattern.NumberOfLines | 0;
		
		var tracks = pattern.Tracks.PatternTrack;

		tracks.forEach(function(track, trackIndex) {

			var lines = track.Lines && track.Lines.Line ? track.Lines.Line : [];
			var trackData = [];

			// Just one line
			if(lines.forEach === undefined) {
				lines = [ lines ];
			}

			lines.forEach(function(line) {
				var rowNumber = line.$.index | 0;
				var lineData = {
					row: rowNumber,
					columns: [],
					effects: []
				};


				if(line.NoteColumns) {
					var noteColumns = line.NoteColumns.NoteColumn;
					
					if(noteColumns.indexOf === undefined) {
						noteColumns = [ noteColumns ];
					}

					noteColumns.forEach(function(column, columnIndex) {
						var columnData = {};
						
						columnData.note = column.Note || null;

						if(columnData.note === '---') {
							// Probably "same note, no change"?
							columnData.note = null;
						}

						// TODO when instrument is '..'
						columnData.instrument = column.Instrument | 0;

						if(column.Volume !== undefined && column.Volume !== '..') {
							columnData.volume = parseInt(column.Volume, 16) * 1.0 / 0x80;
						}

						lineData.columns.push(columnData);
					});
				}

				if(line.EffectColumns) {

					var effectColumns = line.EffectColumns.EffectColumn;

					if(effectColumns.indexOf === undefined) {
						effectColumns = [ effectColumns ];
					}

					effectColumns.forEach(function(column) {
						var name = column.Number;
						var value = column.Value;
						lineData.effects.push({ name: name, value: value });
					});
					
				}
				
				trackData.push(lineData);

			});

			p.tracks.push(trackData);

		});
		
		j.patterns.push(p);
	});


	return j;
}

module.exports = {
	renoiseToOrxatron: renoiseToOrxatron
};
