import { Grid, MenuItem, Select, TextField } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { Pit } from '../../interfaces/Point';
import { EditContainer } from "../../styles/Map";
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import TextareaAutosize from '@mui/material/TextareaAutosize';

interface EditTipProps {
    tip: Pit,
    onEdit: (pit: Omit<Pit, 'images'>) => void;
    onDelete: (_id: string) => void;
    onEditCategoryPit: (category: number) => void;
}

export const EditTip: FC<EditTipProps> = ({
    tip: { coords: tipCoords, category: tipCategory, description: tipDescription, _id },
    onEdit,
    onDelete,
    onEditCategoryPit,
}) => {
    const [coords, setCoords] = useState<[string, string]>([tipCoords[0].toString(), tipCoords[1].toString()]);
    const [description, setDescription] = useState<string>(tipDescription);
    const [category, setCategory] = useState<number>(tipCategory);

    const onEditPit = () => {
        let check = true;
        if (isNaN(Number(coords[0]))) {
            check = false;
        }
        if (isNaN(Number(coords[1]))) {
            check = false;
        }
        if (!check) {
            alert('Coords are not valie. Need use \'wgs 84\' format.')
            return;
        }
        onEdit({
            _id,
            coords: [Number(coords[0]), Number(coords[1])],
            description,
            category,
        })
    };

    useEffect(() => {
        setCoords([tipCoords[0].toString(), tipCoords[1].toString()]);
    }, tipCoords)

    return (
        <>
            <EditContainer isVisible={true} >
                <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                        <TextField
                            autoFocus
                            color='secondary'
                            margin="dense"
                            label="Coord X"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={coords[0]}
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setCoords([value, coords[1]])}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoFocus
                            color='secondary'
                            margin="dense"
                            label="Coord Y"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={coords[1]}
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setCoords([coords[0], value])}
                        />
                    </Grid>

                    <Grid item xs={12}>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={category}
                        style={{ width: '100%', marginTop: '10px' }}
                        color='secondary'
                        onChange={({ target: { value } }) => {
                            setCategory(Number(value));
                            onEditCategoryPit(Number(value));
                        }}
                        label="Category"
                        >
                        <MenuItem value={1}>First</MenuItem>
                        <MenuItem value={2}>Second</MenuItem>
                        <MenuItem value={3}>Third</MenuItem>
                        </Select>
                    </Grid>

                    <Grid item xs={12}>
                        <TextareaAutosize
                            aria-label="minimum height"
                            minRows={3}
                            placeholder="Description"
                            value={description}
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(value)}
                            style={{ minWidth: '99%', maxWidth: '99%', border: '1px solid #9c27b0' }}
                            />
                    </Grid>
                </Grid>

                <div title="Save changes" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '25px' }}>
                    <DoneIcon fontSize="medium" onClick={onEditPit} style={{ color: "lime"}}/>
                </div>

                <div title="Remove it pit" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '25px' }}>
                    <ClearIcon fontSize="medium" onClick={() => { onDelete(_id)}} style={{ color: "red"}} />
                </div>
            </EditContainer>
        </>
    )
}