const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Gjej rrugën e saktë për index.html
const projectRoot = path.join(__dirname, '..');
const indexPath = path.join(projectRoot, 'index.html');

console.log('🔍 Duke kërkuar index.html në:', indexPath);

// Shërbej skedarët statike nga folderi kryesor
app.use(express.static(projectRoot));

// Lidhja me MongoDB
mongoose.connect('mongodb://localhost:27017/voto25', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB U LIDH ME SUKSES!'))
.catch(err => console.log('❌ MongoDB gabim:', err.message));

// ========== MODELS ==========

// Schema për Partitë
const partySchema = new mongoose.Schema({
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    leader: { type: String, required: true },
    foundingYear: { type: Number, required: true },
    ideology: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now }
});
const Party = mongoose.model('Party', partySchema);

// Schema për Votuesit - I PËRDITËSUAR
const voterSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    dateOfBirth: { type: Date, required: true },
    email: { type: String, required: true },
    voterId: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    hasVoted: { type: Boolean, default: false },
    votedCandidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', default: null },
    votedPartyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', default: null },
    voteDate: { type: Date, default: null },
    registrationDate: { type: Date, default: Date.now }
});
const Voter = mongoose.model('Voter', voterSchema);

// Schema për Kandidatët
const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    party: { type: String, required: true },
    city: { type: String, required: true },
    age: { type: Number, required: true },
    dateOfBirth: { type: Date, required: true },
    qualification: { type: String, required: true },
    manifesto: { type: String, required: true },
    votes: { type: Number, default: 0 },
    registrationDate: { type: Date, default: Date.now }
});
const Candidate = mongoose.model('Candidate', candidateSchema);

// ========== FUNKSIONET PËR PËRDITËSIMIN E LISTAVE ==========

async function updateVotersList() {
    try {
        const voters = await Voter.find().sort({ registrationDate: -1 });
        return voters;
    } catch (error) {
        console.log('❌ Gabim në marrjen e votuesve:', error);
        return [];
    }
}

async function updateCandidatesList() {
    try {
        const candidates = await Candidate.find().sort({ registrationDate: -1 });
        return candidates;
    } catch (error) {
        console.log('❌ Gabim në marrjen e kandidatëve:', error);
        return [];
    }
}

async function updatePartiesList() {
    try {
        const parties = await Party.find().sort({ registrationDate: -1 });
        return parties;
    } catch (error) {
        console.log('❌ Gabim në marrjen e partive:', error);
        return [];
    }
}

// ========== API ROUTES ==========

// Admin Login
app.post('/api/admin/login', (req, res) => {
    if (req.body.password === 'admin123') {
        res.json({
            status: 'success',
            message: 'Login i suksesshëm',
            token: 'admin-token'
        });
    } else {
        res.status(401).json({
            status: 'error',
            message: 'Kodi i gabuar'
        });
    }
});

// Merr të gjitha partitë (për dropdown)
app.get('/api/parties', async (req, res) => {
    try {
        const parties = await Party.find().sort({ name: 1 });
        
        // Kthe vetëm emrat e partive për dropdown
        const partyNames = parties.map(party => party.name);
        
        res.json({
            status: 'success',
            data: { 
                parties: partyNames
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gabim: ' + error.message
        });
    }
});

// Regjistro Parti
app.post('/api/parties/register', async (req, res) => {
    try {
        console.log('🏛️ Party data:', req.body);
        
        const partyData = {
            name: req.body.partyName,
            symbol: req.body.partySymbol,
            leader: req.body.partyLeader,
            foundingYear: parseInt(req.body.foundingYear),
            ideology: req.body.partyIdeology
        };

        // Kontrollo nëse partia ekziston
        const existingParty = await Party.findOne({ name: partyData.name });
        if (existingParty) {
            return res.status(400).json({
                status: 'error',
                message: 'Partia me këtë emër ekziston tashmë'
            });
        }

        const party = new Party(partyData);
        const savedParty = await party.save();
        
        console.log('✅ PARTIA U RUAJT NË DATABASE:', savedParty._id);
        
        res.json({
            status: 'success',
            message: 'Partia u regjistrua me sukses',
            data: { 
                party: savedParty
            }
        });
    } catch (error) {
        console.log('❌ Gabim:', error);
        res.status(500).json({
            status: 'error',
            message: 'Gabim: ' + error.message
        });
    }
});

// Regjistro Kandidat
app.post('/api/candidates/register', async (req, res) => {
    try {
        console.log('🎯 Candidate data:', req.body);
        
        const candidateData = {
            name: req.body.candidateName,
            party: req.body.candidateParty,
            city: req.body.candidateCity,
            age: parseInt(req.body.candidateAge),
            dateOfBirth: new Date(req.body.candidateDob),
            qualification: req.body.candidateQualification,
            manifesto: req.body.candidateManifesto
        };

        // KONTROLLO NËSE PARTIA EKZISTON
        const partyExists = await Party.findOne({ name: candidateData.party });
        if (!partyExists) {
            return res.status(400).json({
                status: 'error',
                message: `Partia "${candidateData.party}" nuk ekziston. Ju lutem së pari regjistroni partinë.`
            });
        }

        const candidate = new Candidate(candidateData);
        const savedCandidate = await candidate.save();
        
        console.log('✅ KANDIDATI U RUAJT NË DATABASE:', savedCandidate._id);
        
        res.json({
            status: 'success',
            message: 'Kandidati u regjistrua me sukses',
            data: { 
                candidate: savedCandidate
            }
        });
    } catch (error) {
        console.log('❌ Gabim:', error);
        res.status(500).json({
            status: 'error',
            message: 'Gabim: ' + error.message
        });
    }
});

// Regjistro Votues
app.post('/api/voters/register', async (req, res) => {
    try {
        console.log('📨 Voter data:', req.body);
        
        const voterData = {
            firstName: req.body.voterFirstName,
            lastName: req.body.voterLastName,
            age: parseInt(req.body.voterAge),
            dateOfBirth: new Date(req.body.voterDob),
            email: req.body.voterEmail,
            voterId: req.body.voterId,
            city: req.body.voterCity,
            address: req.body.voterAddress
        };

        // Kontrollo nëse votuesi ekziston
        const existingVoter = await Voter.findOne({ 
            $or: [
                { email: voterData.email },
                { voterId: voterData.voterId }
            ] 
        });
        
        if (existingVoter) {
            return res.status(400).json({
                status: 'error',
                message: 'Votuesi me këto të dhëna ekziston tashmë'
            });
        }

        const voter = new Voter(voterData);
        const savedVoter = await voter.save();
        
        console.log('✅ VOTUESI U RUAJT NË DATABASE:', savedVoter._id);
        
        res.json({
            status: 'success',
            message: 'Votuesi u regjistrua me sukses',
            data: { 
                voter: savedVoter
            }
        });
    } catch (error) {
        console.log('❌ Gabim:', error);
        res.status(500).json({
            status: 'error',
            message: 'Gabim: ' + error.message
        });
    }
});

// Voter Login
app.post('/api/voters/login', async (req, res) => {
    try {
        const { voterId } = req.body;
        console.log('🔐 Voter login attempt:', voterId);

        if (!voterId) {
            return res.status(400).json({
                status: 'error',
                message: 'ID e votuesit është e detyrueshme'
            });
        }

        const voter = await Voter.findOne({ voterId: voterId.trim() });
        
        if (!voter) {
            console.log('❌ Votuesi nuk u gjet me ID:', voterId);
            return res.status(404).json({
                status: 'error',
                message: 'ID e votuesit nuk u gjet'
            });
        }

        console.log('✅ Votuesi u gjet:', voter.firstName, voter.lastName);

        res.json({
            status: 'success',
            data: {
                voter: {
                    _id: voter._id,
                    firstName: voter.firstName,
                    lastName: voter.lastName,
                    voterId: voter.voterId,
                    city: voter.city,
                    age: voter.age,
                    email: voter.email,
                    hasVoted: voter.hasVoted,
                    votedCandidateId: voter.votedCandidateId,
                    voteDate: voter.voteDate
                }
            }
        });

    } catch (error) {
        console.log('❌ Gabim në voter login:', error);
        res.status(500).json({
            status: 'error',
            message: 'Gabim në server'
        });
    }
});

// Merr të gjithë votuesit
app.get('/api/voters', async (req, res) => {
    try {
        const voters = await updateVotersList();
        res.json({
            status: 'success',
            data: { voters }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gabim: ' + error.message
        });
    }
});

// Merr të gjithë kandidatët
app.get('/api/candidates', async (req, res) => {
    try {
        const candidates = await updateCandidatesList();
        res.json({
            status: 'success',
            data: { candidates }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gabim: ' + error.message
        });
    }
});

// Merr të gjitha partitë
app.get('/api/parties/all', async (req, res) => {
    try {
        const parties = await updatePartiesList();
        res.json({
            status: 'success',
            data: { parties }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gabim: ' + error.message
        });
    }
});

// Merr kandidatët sipas qytetit
app.get('/api/candidates/city/:city', async (req, res) => {
    try {
        const city = req.params.city;
        console.log('🏛️ Duke kërkuar kandidatët për qytetin:', city);

        const candidates = await Candidate.find({ city: city });
        
        console.log(`✅ U gjetën ${candidates.length} kandidatë për ${city}`);

        res.json({
            status: 'success',
            data: { candidates }
        });
    } catch (error) {
        console.log('❌ Gabim në marrjen e kandidatëve:', error);
        res.status(500).json({
            status: 'error',
            message: 'Gabim në marrjen e të dhënave'
        });
    }
});

// Votimi - FUNKSIONI I THJESHTË DHE FUNKSIONAL
app.post('/api/voters/vote', async (req, res) => {
    try {
        const { voterId, candidateId } = req.body;
        console.log('🗳️ Duke filluar votimin...');
        console.log('Voter ID:', voterId);
        console.log('Candidate ID:', candidateId);

        if (!voterId || !candidateId) {
            return res.status(400).json({
                status: 'error',
                message: 'ID e votuesit dhe kandidatit janë të detyrueshme'
            });
        }

        // 1. Gjej votuesin
        const voter = await Voter.findOne({ voterId: voterId.trim() });
        if (!voter) {
            console.log('❌ Votuesi nuk u gjet:', voterId);
            return res.status(404).json({
                status: 'error',
                message: 'Votuesi nuk u gjet'
            });
        }

        console.log('✅ Votuesi u gjet:', voter.firstName, voter.lastName);

        // 2. Kontrollo nëse ka votuar tashmë
        if (voter.hasVoted) {
            console.log('❌ Votuesi ka votuar tashmë');
            return res.status(400).json({
                status: 'error',
                message: 'Ju keni votuar tashmë! Votimi i dytë nuk lejohet.'
            });
        }

        // 3. Gjej kandidatin
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            console.log('❌ Kandidati nuk u gjet:', candidateId);
            return res.status(404).json({
                status: 'error',
                message: 'Kandidati nuk u gjet'
            });
        }

        console.log('✅ Kandidati u gjet:', candidate.name);

        // 4. Gjej partinë e kandidatit
        const party = await Party.findOne({ name: candidate.party });
        let partyId = null;
        if (party) {
            partyId = party._id;
            console.log('✅ Partia u gjet:', party.name);
        } else {
            console.log('⚠️ Partia nuk u gjet, por vazhdojmë');
        }

        // 5. PËRDITËSO VOTUESIN - shëno se ka votuar
        await Voter.updateOne(
            { _id: voter._id },
            { 
                hasVoted: true,
                votedCandidateId: candidate._id,
                votedPartyId: partyId,
                voteDate: new Date()
            }
        );

        console.log('✅ Votuesi u përditësua');

        // 6. PËRDITËSO KANDIDATIN - rritje e votave
        await Candidate.updateOne(
            { _id: candidateId },
            { $inc: { votes: 1 } }
        );

        console.log('✅ Kandidati u përditësua');

        // 7. Merr kandidatin e përditësuar për të parë votat e reja
        const updatedCandidate = await Candidate.findById(candidateId);

        console.log(`🎉 VOTA U REGJISTRUA ME SUKSES!`);
        console.log(`Votuesi: ${voter.firstName} ${voter.lastName}`);
        console.log(`Kandidati: ${candidate.name}`);
        console.log(`Partia: ${candidate.party}`);
        console.log(`Vota totale: ${updatedCandidate.votes}`);

        res.json({
            status: 'success',
            message: 'Vota juaj u regjistrua me sukses!',
            data: {
                voter: {
                    hasVoted: true,
                    votedFor: candidate.name,
                    party: candidate.party
                },
                candidate: {
                    name: candidate.name,
                    totalVotes: updatedCandidate.votes
                }
            }
        });

    } catch (error) {
        console.log('❌ Gabim në votim:', error);
        res.status(500).json({
            status: 'error',
            message: 'Gabim në server gjatë votimit: ' + error.message
        });
    }
});

// Merr rezultatet e votimit - KANDIDATËT ME VOTAT
app.get('/api/results', async (req, res) => {
    try {
        console.log('📊 Duke marrë rezultatet e votimit...');
        
        const candidates = await Candidate.find()
            .sort({ votes: -1 }) // Rendit nga me i votuari tek me i paktë i votuari
            .select('name party votes city'); // Zgjidh vetëm fushat që na duhen

        console.log(`✅ U gjetën ${candidates.length} kandidatë për rezultatet`);

        res.json({
            status: 'success',
            data: { 
                candidates: candidates,
                totalVotes: candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
            }
        });
    } catch (error) {
        console.log('❌ Gabim në marrjen e rezultateve:', error);
        res.status(500).json({
            status: 'error',
            message: 'Gabim në marrjen e rezultateve: ' + error.message
        });
    }
});

// Merr rezultatet sipas partive
app.get('/api/results/parties', async (req, res) => {
    try {
        console.log('🏛️ Duke marrë rezultatet sipas partive...');
        
        const partyResults = await Candidate.aggregate([
            {
                $group: {
                    _id: '$party',
                    totalVotes: { $sum: '$votes' },
                    candidatesCount: { $sum: 1 }
                }
            },
            {
                $sort: { totalVotes: -1 }
            }
        ]);

        console.log(`✅ U gjetën ${partyResults.length} parti për rezultatet`);

        res.json({
            status: 'success',
            data: { 
                parties: partyResults,
                totalVotes: partyResults.reduce((sum, party) => sum + party.totalVotes, 0)
            }
        });
    } catch (error) {
        console.log('❌ Gabim në marrjen e rezultateve të partive:', error);
        res.status(500).json({
            status: 'error',
            message: 'Gabim në marrjen e rezultateve të partive: ' + error.message
        });
    }
});

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        const votersCount = await Voter.countDocuments();
        const candidatesCount = await Candidate.countDocuments();
        const partiesCount = await Party.countDocuments();
        
        res.json({
            status: 'OK',
            database: dbStatus,
            counts: {
                voters: votersCount,
                candidates: candidatesCount,
                parties: partiesCount
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Gabim në health check: ' + error.message
        });
    }
});

// Rruga për frontend
app.get('/', (req, res) => {
    res.sendFile(indexPath);
});

app.get('*', (req, res) => {
    res.sendFile(indexPath);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log('🚀 Serveri po xhiron në http://localhost:' + PORT);
    console.log('📍 Shko në http://localhost:5000');
    console.log('📍 Testo: http://localhost:5000/api/health');
});

// Funksion për të kontrolluar lidhjen me database
mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB u lidh me sukses');
});

mongoose.connection.on('error', (err) => {
    console.log('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB u shkëput');
});