import React, { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ClearIcon from '@mui/icons-material/Clear';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Box, Grid, MenuItem, Select, Typography } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DragAndDrop from './UploadFile/DragAndDrop';
import toBase64 from '../utils/toBase64';
import { BlockImageName } from '../styles/CreateNewTip';
import { Pit } from '../interfaces/Point';


export interface CreateSeasonTicket {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (pit: Omit<Pit, '_id'>) => void;
}

export const CreateNewTip = ({ isOpen, onClose, onCreate }: CreateSeasonTicket) => {
    const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [coords, setCoords] = useState<[string, string]>(['', '']);
    const [description, setDescription] = useState<string>('');
    const [category, setCategory] = useState<number>(1);

    const onCreatePit = () => {
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
        onCreate({
            coords: [Number(coords[0]), Number(coords[1])],
            description,
            category,
            images: uploadedFiles,
        });

        setUploadedFileNames([...[]]);
        setUploadedFiles([...[]]);
        setCoords(['', '']);
        setDescription('');
        setCategory(1);
    };

    const handleLoadFiles = async (files: FileList) => {
        const fileList = [];
        const promises = [];
        for (var i = 0; i < files.length; i++) {
            if (!files[i].name) return
            promises.push(toBase64(files[i]));
            fileList.push(files[i].name)
        }
        const convertedImages: string[] = await Promise.all(promises);

        const currNames = [ ...uploadedFileNames ];
        currNames.push(...fileList);

        const currFiles = [ ...uploadedFiles ];
        currFiles.push(...convertedImages);

        setUploadedFiles([...currFiles]);
        setUploadedFileNames([...currNames]);
    }

    const deleteImg = (idx: number) => {
        const images = [ ...uploadedFiles ];
        const imageNames = [ ...uploadedFileNames ];

        images.splice(idx, 1);
        imageNames.splice(idx, 1);

        setUploadedFiles([...images]);
        setUploadedFileNames([...imageNames]);
    }

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Add new pit</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Need add pit location and set pit's categoty.
                </DialogContentText>
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
                        <TextareaAutosize
                            aria-label="minimum height"
                            minRows={3}
                            placeholder="Description"
                            value={description}
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(value)}
                            style={{ minWidth: '99%', maxWidth: '99%', border: '1px solid #9c27b0' }}
                            />
                    </Grid>

                    <Grid item xs={12}>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={category}
                        style={{ width: '100%', marginTop: '10px' }}
                        color='secondary'
                        onChange={({ target: { value } }) => { setCategory(Number(value))}}
                        label="Category"
                        >
                        <MenuItem value={1}>First</MenuItem>
                        <MenuItem value={2}>Second</MenuItem>
                        <MenuItem value={3}>Third</MenuItem>
                        </Select>
                    </Grid>
                </Grid>

                <DragAndDrop handleDropProps={handleLoadFiles}>
                    <Box style={{
                        width: '100%',
                        height: '100%',
                        minHeight: '27vh',
                        maxHeight: '27vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid #00000038',
                        marginTop: '10px',
                        flexDirection: 'column',
                        overflowY: 'auto',
                    }}>
                        {!uploadedFileNames.length && <Typography style={{ color: '#868686' }}>Upload images</Typography>}
                        {uploadedFileNames.map((nameImg, idx) => (
                            <BlockImageName>
                                <Typography>{nameImg}</Typography>

                                <ClearIcon fontSize="small" onClick={() => { deleteImg(idx) }} />
                            </BlockImageName>
                        ))}
                    </Box>
                </DragAndDrop>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'space-evenly' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onCreatePit}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};
