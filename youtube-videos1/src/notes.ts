interface NotesData {
  [category: string]: {
    [playlist: string]: string;
    notes: string;
  };
}

export const notesData: NotesData = {
    "All":{
      "notes": "Notes for All Categories",
    },
    "LinkedIn": {
      "notes": "Notes for LinkedIn category"
    },
    "News": {
      "notes": "Notes for News category"
    },
    "Corporate": {
      "notes": 'Here is corporate gyaan',
      "Multiple Job Offers": "Notes for Multiple Job Offers playlist",
      "Notice Period": "Notes for Notice Period playlist"
    }
  }
  