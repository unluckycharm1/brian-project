<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name', 
        'email',
        'program',
        'gender',
        'birthdate',
        'yr_level',
    ];
    protected $casts = [ 
        'birthdate' => 'date',
    ];
    protected $appends = [
        'age',
    ];

    public function getAgeAttribute()
    {
        return $this->birthdate ?->age ;
    }

}