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

	patterns.forEach(function(pattern) {

		var tracks = pattern.Tracks.PatternTrack;

		tracks.forEach(function(track, trackIndex) {

			var lines = track.Lines && track.Lines.Line ? track.Lines.Line : [];
			
			if(tracksSettings[trackIndex] === undefined) {
				tracksSettings[trackIndex] = 0;
			}

			lines.forEach(function(line) {
				var noteColumns = line.NoteColumns.NoteColumn;
				var numColumns;

				if(noteColumns.indexOf) {
					numColumns = noteColumns.length;
				} else {
					numColumns = 1;
				}

				tracksSettings[trackIndex] = Math.max(numColumns, tracksSettings[trackIndex]);
			});

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

			lines.forEach(function(line) {
				var rowNumber = line.$.index | 0;
				var noteColumns = line.NoteColumns.NoteColumn;
				var lineData = {
					row: rowNumber,
					columns: []
				};
				
				if(noteColumns.indexOf === undefined) {
					noteColumns = [ noteColumns ];
				}

				noteColumns.forEach(function(column, columnIndex) {
					var columnData = {};
					
					columnData.note = column.Note || null;

					// TODO when instrument is ..
					columnData.instrument = column.Instrument | 0;

					columnData.volume = column.Volume !== undefined ? column.Volume : null;

					lineData.columns.push(columnData);
				});
				
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
