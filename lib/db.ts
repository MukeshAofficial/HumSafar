
import { supabase } from './supabase';

/**
 * Supabase Database Layer
 */

export type CircleType = 'college' | 'it-park' | 'office' | 'neighbor';
export type VehicleType = 'bike' | 'auto' | 'car';
export type TripStatus = 'confirmed' | 'arriving' | 'at-pickup' | 'in-transit' | 'completed';
export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  gender: Gender;
  phone?: string;
  isPhoneVerified?: boolean;
  workplace?: string;
  role: 'rider' | 'driver';
  balance: number;
  commuteCredits: number;
  home: string;
  work: string;
  startTime: string;
  endTime: string;
  bio: string;
  emergencyContact?: EmergencyContact;
  car?: {
    model: string;
    color: string;
    seats: string;
    licensePlate: string;
  };
}

export interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  driverGender: Gender;
  driverRating: number;
  driverImg: string;
  car: string;
  vehicleType: VehicleType;
  route: string;
  time: string;
  cost: number;
  seatsTotal: number;
  seatsLeft: number;
  circleType: CircleType;
  circleName: string;
  isWomenOnly?: boolean;
}

export interface Trip {
  id: string;
  rideId: string;
  partnerName: string;
  partnerImg: string;
  route: string;
  time: string;
  cost: number;
  status: TripStatus;
  role: 'rider' | 'driver';
  vehicleType: VehicleType;
  vehicleInfo: string;
}

export interface RideRequest {
  id: string;
  riderId: string;
  riderName: string;
  riderImg: string;
  route: string;
  time: string;
  distance: string;
  status: 'pending' | 'accepted';
}

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest',
  name: 'Guest User',
  email: 'guest@humsafar.app',
  gender: 'other',
  role: 'rider',
  balance: 0,
  commuteCredits: 0,
  home: '',
  work: '',
  startTime: '',
  endTime: '',
  bio: '',
  car: { model: '', color: '', seats: '', licensePlate: '' },
  emergencyContact: { name: '', phone: '' }
};

export const db = {
  getUser: async (): Promise<UserProfile> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return DEFAULT_GUEST_USER;
    }

    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    // Self-healing: Create profile if it doesn't exist but user is authenticated
    if (error || !data) {
      console.log('Profile missing or fetch error, attempting recovery for:', session.user.id);
      
      const newProfile = {
        id: session.user.id,
        name: session.user.user_metadata?.full_name || 'New User',
        email: session.user.email,
        role: 'rider',
        balance: 1000,
        commute_credits: 50,
        is_phone_verified: false,
        home: 'Not Set',
        work_loc: 'Not Set',
        bio: 'New Commuter',
        gender: 'prefer-not-to-say'
      };

      // Use upsert to handle potential race conditions safely
      const { data: insertedProfile, error: insertError } = await supabase
        .from('profiles')
        .upsert([newProfile])
        .select()
        .single();

      if (insertError || !insertedProfile) {
         console.error('Failed to recover profile:', insertError);
         // Fallback with authenticated ID to prevent "guest" id
         return { ...DEFAULT_GUEST_USER, id: session.user.id, email: session.user.email || '' };
      }
      
      data = insertedProfile;
    }

    // Map DB columns to UserProfile
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      gender: data.gender,
      phone: data.phone,
      isPhoneVerified: data.is_phone_verified,
      workplace: data.workplace,
      role: data.role,
      balance: data.balance,
      commuteCredits: data.commute_credits,
      home: data.home,
      work: data.work_loc, 
      startTime: data.start_time,
      endTime: data.end_time,
      bio: data.bio,
      emergencyContact: data.emergency_contact,
      car: data.car
    };
  },

  updateUser: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error("Not authenticated");

    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.email !== undefined) payload.email = updates.email;
    if (updates.gender !== undefined) payload.gender = updates.gender;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.isPhoneVerified !== undefined) payload.is_phone_verified = updates.isPhoneVerified;
    if (updates.workplace !== undefined) payload.workplace = updates.workplace;
    if (updates.role !== undefined) payload.role = updates.role;
    if (updates.balance !== undefined) payload.balance = updates.balance;
    if (updates.commuteCredits !== undefined) payload.commute_credits = updates.commuteCredits;
    if (updates.home !== undefined) payload.home = updates.home;
    if (updates.work !== undefined) payload.work_loc = updates.work;
    if (updates.startTime !== undefined) payload.start_time = updates.startTime;
    if (updates.endTime !== undefined) payload.end_time = updates.endTime;
    if (updates.bio !== undefined) payload.bio = updates.bio;
    if (updates.emergencyContact !== undefined) payload.emergency_contact = updates.emergencyContact;
    if (updates.car !== undefined) payload.car = updates.car;

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', session.user.id);

    if (error) throw error;
    
    return db.getUser();
  },

  getRides: async (): Promise<Ride[]> => {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting rides', error);
      return [];
    }

    return data.map((r: any) => ({
      id: r.id,
      driverId: r.driver_id,
      driverName: r.driver_name,
      driverGender: r.driver_gender,
      driverRating: r.driver_rating,
      driverImg: r.driver_img,
      car: r.car,
      vehicleType: r.vehicle_type,
      route: r.route,
      time: r.time,
      cost: r.cost,
      seatsTotal: r.seats_total,
      seatsLeft: r.seats_left,
      circleType: r.circle_type,
      circleName: r.circle_name,
      isWomenOnly: r.is_women_only
    }));
  },

  getTrips: async (): Promise<Trip[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) return [];

    return data.map((t: any) => ({
      id: t.id,
      rideId: t.ride_id,
      partnerName: t.partner_name,
      partnerImg: t.partner_img,
      route: t.route,
      time: t.time,
      cost: t.cost,
      status: t.status,
      role: t.role,
      vehicleType: t.vehicle_type,
      vehicleInfo: t.vehicle_info
    }));
  },

  updateTripStatus: async (tripId: string, status: TripStatus): Promise<Trip[]> => {
    // Optimistic update logic for rewards could go here
    const { error } = await supabase
      .from('trips')
      .update({ status })
      .eq('id', tripId);
    
    if (error) console.error("Update trip error", error);

    return db.getTrips();
  },

  createRide: async (ride: Omit<Ride, 'id' | 'driverId' | 'driverName' | 'driverGender' | 'driverRating' | 'driverImg' | 'car' | 'circleType' | 'circleName' | 'vehicleType'>): Promise<Ride> => {
    const user = await db.getUser();
    
    // Construct DB payload
    const payload = {
      driver_id: user.id,
      driver_name: user.name,
      driver_gender: user.gender,
      driver_rating: 5.0,
      driver_img: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`,
      car: user.car?.model || 'Shared Vehicle',
      vehicle_type: 'car',
      route: ride.route,
      time: ride.time,
      cost: ride.cost,
      seats_total: ride.seatsTotal,
      seats_left: ride.seatsTotal,
      circle_type: 'neighbor',
      circle_name: (user.home && user.home.split(',')[0]) || 'Neighborhood',
      is_women_only: ride.isWomenOnly
    };

    const { data, error } = await supabase
      .from('rides')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    // Create a corresponding trip for the driver so it appears in their active trips
    const tripPayload = {
        user_id: user.id,
        ride_id: data.id,
        partner_name: 'Waiting for Riders',
        partner_img: 'https://ui-avatars.com/api/?name=passengers&background=e2e8f0&color=64748b',
        route: ride.route,
        time: ride.time,
        cost: ride.cost,
        status: 'confirmed', // Indicates ride is active
        role: 'driver',
        vehicle_type: 'car',
        vehicle_info: user.car?.model || 'Shared Vehicle'
    };

    await supabase.from('trips').insert([tripPayload]);

    return {
      ...ride,
      id: data.id,
      driverId: data.driver_id,
      driverName: data.driver_name,
      driverGender: data.driver_gender,
      driverRating: data.driver_rating,
      driverImg: data.driver_img,
      car: data.car,
      vehicleType: data.vehicle_type as VehicleType,
      seatsLeft: data.seats_left,
      circleType: data.circle_type as CircleType,
      circleName: data.circle_name
    };
  },

  bookRide: async (rideId: string, useCredits: boolean = false): Promise<boolean> => {
    const user = await db.getUser();
    const { data: ride } = await supabase.from('rides').select('*').eq('id', rideId).single();
    
    if (!ride || ride.seats_left <= 0) return false;

    let finalCost = ride.cost;
    let newBalance = user.balance;
    let newCredits = user.commuteCredits;

    if (useCredits) {
      if (user.commuteCredits >= ride.cost) {
        newCredits -= ride.cost;
        finalCost = 0;
      } else {
        finalCost -= user.commuteCredits;
        newCredits = 0;
      }
    }

    if (newBalance < finalCost) return false;
    newBalance -= finalCost;

    // 1. Update User Balance
    await db.updateUser({ balance: newBalance, commuteCredits: newCredits });

    // 2. Update Ride Seats
    await supabase.from('rides').update({ seats_left: ride.seats_left - 1 }).eq('id', rideId);

    // 3. Create Trip for Rider
    const tripPayload = {
      user_id: user.id,
      ride_id: ride.id,
      partner_name: ride.driver_name,
      partner_img: ride.driver_img,
      route: ride.route,
      time: ride.time,
      cost: ride.cost,
      status: 'confirmed',
      role: 'rider',
      vehicle_type: ride.vehicle_type,
      vehicle_info: ride.car
    };
    await supabase.from('trips').insert([tripPayload]);

    return true;
  },

  getRideRequests: async (): Promise<RideRequest[]> => {
    const { data, error } = await supabase.from('requests').select('*').eq('status', 'pending');
    if (error) return [];
    
    return data.map((r: any) => ({
      id: r.id,
      riderId: r.rider_id,
      riderName: r.rider_name,
      riderImg: r.rider_img,
      route: r.route,
      time: r.time,
      distance: r.distance,
      status: r.status
    }));
  },

  postRideRequest: async (request: Omit<RideRequest, 'id' | 'riderId' | 'riderName' | 'riderImg' | 'status' | 'distance'>): Promise<RideRequest> => {
    const user = await db.getUser();
    const payload = {
      rider_id: user.id,
      rider_name: user.name,
      rider_img: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`,
      route: request.route,
      time: request.time,
      distance: 'Just posted',
      status: 'pending'
    };

    const { data, error } = await supabase.from('requests').insert([payload]).select().single();
    if (error) throw error;

    return {
      id: data.id,
      riderId: data.rider_id,
      riderName: data.rider_name,
      riderImg: data.rider_img,
      route: data.route,
      time: data.time,
      distance: data.distance,
      status: data.status as 'pending'
    };
  },

  acceptRideRequest: async (requestId: string): Promise<boolean> => {
    const { data: request } = await supabase.from('requests').select('*').eq('id', requestId).single();
    if (!request) return false;

    // 1. Update Request Status
    await supabase.from('requests').update({ status: 'accepted' }).eq('id', requestId);

    // 2. Create Ride
    const user = await db.getUser();
    const ride = await db.createRide({
      route: request.route,
      time: request.time,
      cost: 75.00,
      seatsTotal: 1,
      seatsLeft: 0,
      isWomenOnly: false
    });

    // 3. Create Trip for Driver
    const tripPayload = {
      user_id: user.id,
      ride_id: ride.id,
      partner_name: request.rider_name,
      partner_img: request.rider_img,
      route: request.route,
      time: request.time,
      cost: 75.00,
      status: 'confirmed',
      role: 'driver',
      vehicle_type: 'car',
      vehicle_info: 'Shared Vehicle'
    };
    await supabase.from('trips').insert([tripPayload]);

    return true;
  }
};
